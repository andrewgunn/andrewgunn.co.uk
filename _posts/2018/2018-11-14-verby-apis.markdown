---
layout: post
title: Verby APIs
tags:
- API
- ASP.NET Core
---

I'm pretty confident the vast majority of developers have either used or are at least familiar with [RESTful APIs](https://en.wikipedia.org/wiki/Representational_state_transfer). I have a love-hate relationship with them. On the one hand, I understand the rationale behind the architecture and agree with ~~all~~ most of the [constraints](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints) which has has driven me to create the most beautiful APIs you could imagine. However, there is a *but* - I always end up having to [bastardise](https://www.urbandictionary.com/define.php?term=bastardise) my design to satisfy a requirement that goes beyond traditional CRUD calls.

Here's a few RESTful contracts that follow the usual trend of using the HTTP Method to indicate the operation around a resource:

```yaml
 # Create a new user
/users   POST

# Find a specific user
/users/:userId  GET

# Update a specific user
/users/:userId  PUT

# Delete a specific user
/users/:userId  DELETE
```

**C**reate, **R**ead, **U**pdate, **D**elete. **CRUD**. But what if we want to *[Clone](https://stackoverflow.com/questions/:userId8755220/what-is-the-restful-way-to-represent-a-resource-clone-operation-in-the-url#answer-18755334)* a user? Or *[Block](https://developer.github.com/v3/users/blocking/#block-a-user)*/*[Unblock](https://developer.github.com/v3/users/blocking/#unblock-a-user)* them? Yes, there are "RESTful" ways to do this, but they all suck IMO. Let's take a closer look at some of the proposed solutions I've seen for cloning a user: 

- Custom HTTP Method
- Special header as part of a PUT request
- Query string argument (pointing to the original resource) as part of a POST request

...but my particular favourite is creating a fake child resource to house the clones (e.g. `users/:userId/clones`). Really? And all because we want to be RESTful!

My point is that you'll spend unnecessary time trying to convert business rules into a CRUD pattern just for the sake of it. It reminds me when [ASP.NET MVC 1.0](https://en.wikipedia.org/wiki/ASP.NET_MVC) was released and everyone (including myself) was on the N-Tier bandwagon after reading about [NerdDinner](http://www.wrox.com/WileyCDA/WroxTitle/Professional-ASP-NET-MVC-2.productCd-0470643188.html). We blindly abstracted an abstraction in the form of `IRepository<T>` that gave us a warm feeling inside, only to realise that it was ultimately a waste of time (but that's for another blog post).

Ensuring everyone speaks the same ubiqutous language is more crucial to the success of a project and this applies directly to the code along with any integration points that are exposed. The fact that there is only a finite number of HTTP Methods that don't always align with the business domain contradicts that statement. If we could extend this list, I'd probably be writing a completely different blog post or nothing at all, but we can't. 

Luckily, I have the answer in the form of **Verby APIs** ([Tweet](https://twitter.com/intent/tweet?text=%40{{ site.twitter_username | url_encode }}%20Verby%20API%20is%20a%20rubbish%20name.%20You%20should%20call%20it...%20) me if you have a better name).

Verby APIs only use two of most common HTTP Methods; `GET` for reading state and `POST` for changing state which is similar to how websites (should) work. The URLs follow a simple convention that will be familiar to any [RESTafarian](https://en.wiktionary.org/wiki/RESTafarian):

```yaml
 # Create a new user
/users/create   POST

# Find a specific user
/users/:userId/find   GET

# Update a specific user
/users/:userId/update POST

# Delete a specific user
/users/:userId/delete POST
```

Hopefully you'll be able to see where the name comes from - every URL ends in a verb. Be creative, but it's always good to have some common verbs to cover the basic (CRUD) operations; `CREATE`, `FIND`, `LIST`, `DELETE`, `UPDATE`. In terms of the URL structure before the verb, it's petty much RESTful with a parent resource followed by an identifier and any optional child resource. Simples.

You might be reading thinking this is an outrageous idea, but ask yourself why you're so against it. I'd suggest telling me in the comments, but I haven't got round to adding them yet 😉.

Verby APIs tie in really nicely with [CQS (Command Query Separataion)](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation) but I'll talk more about that in my next post.
