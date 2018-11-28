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

Many developers think it's a bad idea to throw exceptions. I don't. There's nothing better than a custom exception to encapsulate the error and any associated data. Obviously it depends on the project and how many exceptions are being thrown, but for APIs, it works. 

One of common arguments against the use of exceptions in terms of application flow is the performance cost. 

[Why Exceptions should be Exceptional](http://mattwarren.org/2016/12/20/Why-Exceptions-should-be-Exceptional/)

- Create and throw custom exceptions
- Create models to represent the response
- Create exception handlers to handle each custom exception and coordinate the response content and status code
- Gunnsoft.Api `.UseJsonExceptions` middleware

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
