---
layout: post
title: Handling API Errors in ASP.NET Core
tags:
- API
- ASP.NET Core
- Gunnsoft
---

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
