---
layout: post
title: Handling API Errors in ASP.NET Core
tags:
- API
- ASP.NET Core
- Errors
- Gunnsoft
---

I hate doing the same thing over and over again. As a developer, it's my job to eradicate repetitive tasks by adding automation. This principle can be applied to code, and in particular, the handling of API errors.

<img src="https://http.cat/418" />

Many developers think it's a bad idea to use exceptions to control application flow. I'm not one of them. Obviously, it depends on the application and the amount of exceptions being thrown, but for APIs, it just works.

One of the most common arguments against the use of exceptions for this scenario is the [degradation in performance](http://mattwarren.org/2016/12/20/Why-Exceptions-should-be-Exceptional/). I can't deny the fact that throwing an exception will incur an additional cost compared to using something like error codes, but I doubt it'll ever be something to worry about. My gripe with error codes is that they're too passive. In other words, I _could_ forget to handle them. Okay, test coverage _might_ help, but what if I forget to add a test? Exceptions, on the other hand, have to be handled, otherwise they'll bubble up to the surface. Another negative, which is more a matter of opinion, is that I prefer a cleaner contract as opposed to a custom type to encapsulate the actual result, error code, and any other useful information.

Another agrument against the excessive use of exceptions, which is the one I want to discuss further, is that handling exceptions is an anti-pattern. I could easily argue that this is also true about error codes, but I won't go there. Instead, I want to talk about a way to handle ALL exceptions with a single `try/catch` block? Sounds good, right? But how would it work?

Before we talk about handling exceptions, let's talk about the exceptions themselves. Instead of throwing generic ones, create bespoke exceptions that describe each error and contain any relevant information that might be useful for diagnosis.

```csharp
public class UserNotFoundException : Exception
{
  public UserNotFoundException(Guid userId)
  {
      UserId = userId;
  }

  public Guid UserId { get; }
}
```

Assuming there is a method to find a User that returns an instance of `User`, this exception will be thrown if the User can't be found. Okay, this method could return `null` instead, but that'd require a `null` check whenever this method is called. And remember, I don't like repitition.

So how will the exception be handled? An *exception handler*, obviously.

```csharp
public class UserNotFoundExceptionHandler
    : IExceptionHandler<UserNotFoundException>
{
  public async Task HandleAsync(HttpContext context, UserNotFoundException exception)
  {
      var response = new UserNotFoundResponse();

      await context.Response.WriteJsonAsync(HttpStatusCode.Conflict, response, JsonConstants.JsonSerializerSettings);
  }
}
```

Exception handlers have one job; handle an exception and maniuplate the response to the client. Each one implements a common interface `IExceptionHandler<TException>`, giving them direct access to the `HttpContext`. In the example above, the status code is set to `409 Conflict` and an instance of `UserNotFoundResponse` is serialized to JSON and used for the body.

```csharp
public class ErrorResponse
{
  public ErrorResponse(stirng errorCode, string errorMessage)
  {
      ErrorCode = errorCode;
      ErrorMessage = errorMessage;
  }

  public string ErrorCode { get; }
  public string ErrorMessage { get; }
}

public class UserNotFoundResponse : ErrorResponse
{
  public UserNotFoundResponse()
    : base("UserNotFound", "The user wasn't found.")
  {
  }
}
```

The end result is a response that looks something like this:

```yaml
409
{
   "errorCode": "UserNotFound",
   "errorMessage": "The user wasn't found"
}
```

It's worth noting that a status code of `404 Not Found` isn't suitable in this scenario because it *could* create ambiguity.

> `409 Conflict`
>
> The request could not be completed due to a conflict with the current state of the target resource. This code is used in situations where the user might be able to resolve the conflict and resubmit the request.

Assuming the URL is `/users/:userId/find`, a status of `409 Conflict` indicates the URL is valid and the endpoints exists, but there isn't a User for the respective User ID. This puts the onus on the client to amend the URL so it contains a legitimate User ID.

So to recap, for each type of error, create a custom exception, exception handler, and error response.

Now to get all this working, you'll need a decent amount of boilerplate code to handle exceptions globally and pair them up with the respective exception handler. To save you the bother, I created [__Gunnsoft.Api__](https://github.com/Gunnsoft/gunnsoft-api). Simply add the Gunnsoft.Api [NuGet package](https://www.nuget.org/packages/Gunnsoft.Api/) and make a few tweaks to Startup.cs.

_Disclaimer: This library, like me, is stronhly opinionated so you'll also need to install `Autofac` and `Autofac.Extensions.DependencyInjection`._

```csharp
using Autofac;
using Autofac.Extensions.DependencyInjection;

public void Configure(IApplicationBuilder app)
{
  app.UseJsonExceptions();

  // ...
}

public IServiceProvider ConfigureServices(IServiceCollection services)
{
  // ...

  var containerBuilder = new ContainerBuilder();
  containerBuilder.AddExceptionHandlers();
  containerBuilder.Populate(services);

  var container = containerBuilder.Build();

  return new AutofacServiceProvider(container);
}
```

That's it. You're now ready to handle errors _properly_.

Under the hood, Gunnsoft.Api adds a middleware that houses a single `try/catch` and relies on Autofac to find the exception handler. In the (hopefully unlikely) event that an exception handler hasn't been created, a default exception handler will be called (which is built into the library). Whilst this doesn't give the client any indiciation as to what went wrong, it does provide a consistent response that can still be handled.

A code sample can be found at [Gunnsoft Samples](https://github.com/Gunnsoft/gunnsoft-samples).