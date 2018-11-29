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

Many developers think it's a bad idea to use exceptions to control application flow. I'm not one of them. Obviously, it depends on the application and how many exceptions are being thrown, but for APIs, it just works. 

One of the most common arguments against the use of exceptions for this scenario is the [degradation in performance](http://mattwarren.org/2016/12/20/Why-Exceptions-should-be-Exceptional/). I can't deny the fact that throwing an exception will incur an additional cost compared to using something like error codes, but I doubt it'll ever be something to worry about. 

Another agrument, which is the one I want to discuss further, is that handling exceptions can often be seen as an anti-pattern. But what if there was a way to handle ALL exceptions with a single `try/catch` block? Sounds good, right? But how would it work?

Before we talk about handling exceptions, let's talk about the exceptions themselves. Intead of throwing a generic one, create bespoke exceptions that describe each error and contain any relevant information that might be useful for diagnosis.

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
    public async Task HandleAsync
    (
        HttpContext context, 
        UserNotFoundException exception
    )
    {
        var response = new UserNotFoundResponse();

        await context.Response.WriteJsonAsync
        (
            HttpStatusCode.Conflict, 
            response, 
            JsonConstants.JsonSerializerSettings
        );
    }
}
```

```csharp
public class UserNotFoundResponse : ErrorResponse
{
    public UserNotFoundResponse()
        : base
        (
            "UserNotFound",
            "The user wasn't found."
        )
    {
    }
}
```

So to recap, for each type of error, create a custom exception, exception handler, and error response. The error response contains will be returned to the client in the body of the response along with the specified status code.

```yaml
409
{
   "errorCode": "UserNotFound",
   "errorMessage": "The user wasn't found"
}
```

It's worth pointing out the status code in this example - `404 Not Found` isn't suitable because it *could* create ambiguity. 

> `409 Conflict`
>
> The request could not be completed due to a conflict with the current state of the target resource. This code is used in situations where the user might be able to resolve the conflict and resubmit the request.

Assuming the URL is `/users/:userId/find`, a status of `409 Conflict` indicates the URL is valid and the endpoints exists, but there isn't a User for the respective User ID. This puts the onus on the client to amend the URL so it contains a legitimate User ID.




```csharp
public void Configure(IApplicationBuilder app)
{
  app.UseJsonExceptions();

  // ...
}
```

NuGet packages:

- `Autofac`
- `Autofac.Extensions.DependencyInjection`

```csharp
using Autofac;
using Autofac.Extensions.DependencyInjection;

// ...

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
