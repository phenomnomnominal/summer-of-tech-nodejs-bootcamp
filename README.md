# Summer of Tech - Node.js Bootcamp

This bootcamp is going to guide you through the basics of [**Node.js**][node]!
We will be making a real-time chat app, but the focus will be on the server-side
**JavaScript**, so most of the **HTML**, client-side **JS** and **CSS**
will be done for you!

## How's it going to work?

We will build our chat in several steps! At each step follow along with the
instructions and update the project. Each step has a corresponding tag in this
git repo, so if you can't get it to work at any point, just checkout the next
tag and look at the code.

## Pre-requisites:

This bootcamp is going to be very **JavaScript** heavy (obviously), so if you
haven't done any before, or want a refresher, check out [this][learn]! It will
give you a quick booster shot of **JavaScript**.

If you're looking for some other good JavaScript resources, check out the
following:

* [A re-introduction to JavaScript][reintro]
* [Crockford on JavaScript][crockford]
* [Eloquent JavaScript][eloquent]

## First things first...

Check you have **Node.js** (v0.10.30) installed:

    node --version

Then you need to check out this repository, so pick a sensible place for the
repo, and then run:

    git clone https://github.com/phenomnomnominal/summer-of-tech-node-bootcamp.git

Make sure you're at the right point in the repo:

    git checkout bootcamp-start

Then, let's get going!

# STEP 1.

To update to this point, run:

    git checkout step-1

### Node.js packages: [**npm**][npm], **Express**, and **package.json**:

**Node** uses a tool called **npm** to manage dependencies within an application.
**npm** works from the command line and has tonne of useful features, for
example:

> #### Install a package:
>
>     npm install <package name>
>
> #### Uninstall a package:
>
>     npm uninstall <package name>
>
> #### Search for a package:
>
>     npm search <search term>

We will use **npm** for all our server-side dependencies for this app.

___

### Installing Express:

Our application is going to be built based off a framework called
[**Express**][express], which is a very commonly used framework for **Node**.
This means that **Express** will be our first dependency. **Express** gives
us a project generator tool, which we will try to install using **npm**.

We want the generator to be installed *globally*, so we pass the `-g` flag to
the installer, followed by the name of the package:

    npm install -g express-generator

If the install worked, go to wherever you cloned the project repo to, and run
the `express` command:

    express

This will throw an error saying *"destination is not empty, continue?"*. This is
fine, so just respond "y", and it will generate the base for our app.

> ### IMPORTANT!
> The global install might fail if you don't have permissions to install
> packages globally on your machine. Luckily, there is a *minor* hack that we
> can use to get around this:
>
> First, install the module locally:
>
>     npm install express-generator
>
> Then, create a file called *package.json* in the root of the repository that
> contains the following:
>
>     {
>       "scripts": {
>         "express": "express"
>       }
>     }
>
> Finally, run the following:
>
>     npm run express
>
> You will get the *"destination is not empty"* error, but just respond y.
>
> If that still doesn't work, check out the **"no-global"** branch of this repo..
>
>     git checkout tags/no-global

___

### App structure:

Once you've got to this point (either by running `express` or by checking out
the **"no-global"** tag), you should have a directory containing the
structure of our app!

It should look something like this:

    | - app.js
    | - bin     ->
                 | - www
    | - package.json
    | - public  ->
                 | - images
                 | - javascripts
                 | - stylesheets
    | - README.md
    | - routes  ->
                 | - index.js
                 | - users.js
    | - views   ->
                 | - error.jade
                 | - index.jade
                 | - layout.jade

Take a few minutes and have a look through each of the files we've got.

* **app.js** - This is the file that is currently doing most of the work in
our app. It will slim down a bit by the end of the bootcamp, but currently it
pulls in the main dependencies of the app, and configures how the app works.

* **bin/www** - This file launches the app, and starts the server. By default
it will be listening on port `3000`

* **package.json** - This is one of the most important files in a **Node**
project. It lists all the main information about an application, including its
dependencies, and any scripts assosciated with the project. See the line that
says `"start": "node ./bin/www"`? That means that when you run `npm start`,
it will start running the **Node** process and pass it the *bin/www* script
to run, which will start the server.

* **public/** - The *public* directory is where any static assets live,
scripts, images, CSS, that sort of thing. Since we are focussing on the backend,
we won't do too much in here.

* **routes/** - The *routes* directory contains the scripts tht are run as you
navigate to different parts of the application. If you look in the *app.js* file
you will see that these files are `require`d in as dependencies, and used for
the *'/'* and *'/users'* routes respectfully.

* **views/** - The *views* directory contains the [**jade**][jade] templates
for the project. **Express** uses Jade as its default templating language. You
can change it, but for the purpose of this bootcamp, it will do!

One thing that is worth noting that you might have realised from the structure
of the app, is how we are creating almost all of the parts of the application
ourselves. We have to fire up the server ourselves, write error handlers,
connect the routes, pretty much everything. **Express** simplifies a lot of it
for us, but if we want, we can change very low-level details of the app and how
it behaves.

___

### Installing dependencies:

If you looked inside **package.json**, you will see the list of dependencies
of the app. We have to actually install these, which we do by running the
following:

    npm install

As you will see, this goes off and downloads all of our dependencies that are
listed in the **package.json** file, and all of their dependencies, and
places them in a folder called *node_modules/*.

> ### IMPORTANT!
> If this doesn't work, you might need to modify your *package.json* file so
> that the name doesn't contain any spaces!

___

### Running the app:

Now that we know what's going on with our app outline, and we have all our
dependencies installed, we can run it for the first time and see what we get:

    npm start

Now open a browser and point it at http://localhost:3000 - for bonus points,
navigate to */users* and have a look in */routes/users.js* to see why you get
the result that you do.

# STEP 2.

To update to this point, run:

    git checkout step-2

### socket.io and our first changes (woot!):

Now that we have our basic app down, and it does something (not much, but
still!), we can finally make it do something slightly more useful!

One of the great things about **Node.js** is how it is ideal for real-time
applications. You might have heard or read how **Node** uses an "event-driven,
non-blocking I/O model", but what does that actually mean?

If you have ever written client-side JavaScript, you might be familiar with AJAX
(**A**synchronous **J**avaScript **A**nd **X**ML). This acronym doesn't mean
much anymore, as JSON (**J**ava**S**cript **O**bject **N**otation) has
predominantly taken over from XML as the data exchange format, but the concept
is the same. It works something like this:

1. A user clicks a button on a page in the web browser.
2. The main thread on the client page sends a request to a server somewhere.
3. The main thread just continues doing what it was before, and the user doesn't
notice any slowdown.
4. Meanwhile, the server processes the request in its own time, then returns the
response to the client, which handles the request as it sees fit.

**Node** works in a similar way:

1. The server receives a request from some client somewhere.
2. The main thread on the server spins up another process to perform some sort
of I/O operation, getting something from a database, sending a request to
another server, writing a file, that sort of thing.
3. The main thread is free to to handle other requests as they come in.
4. When the server is done with the request, it passes the result back to the
main thread which returns it to the client.

This event-driven model makes **Node** perfect for creating real-time apps with
WebSockets. **WebSockets** are an implementation of Sockets for the web,
enabling lightweight, two-way client-server communications without all the
overhead of classic HTTP requests. We have been using clunky technique like
"long-polling" for a while now, but **WebSockets** now give us a much better,
standardised way to get real-time apps on the web. To read up more on WebSockets
and how they work, check out [this][WebSockets].

___

### Installing socket.io:

[**socket.io**][socket] is another very popular **Node** package, that abstracts
away some of the tricky issues behind WebSockets, and provides fall backs to old
techniques for real-time in browsers that don't have WebSockets. It is going to
be our first *local* dependency, a dependency that we only need to have for this
project, not globally. There are two ways to add this dependency:

1. **Add it to our *package.json* file manually.** - This is a fine way
to add a dependency, especially if you know exactly what version you want to use,
but it can quickly become a bit of an effort to maintain.

2. **Use npm to install the package** - by running `npm install socket.io`
we can install the package. If we add the `--save` flag, the dependency will
automatically be added to our *package.json* file.

For now, let's use the second method:

    npm install socket.io --save

Take a quick look inside *package.json* to see that it got saved. You will
notice that a version number was added too, even though we didn't specify one.
These version numbers follow the [**semver**][semver] spec (Semantic Versioning)
and define what version **npm** should look for when it installs this app
on another machine. The `^` means it will look for the latest version that is
compatible with the listed version. You can read more about how versioning works
in **npm** [here][npmsemver]

___

### Getting socket.io into our app:

Take another look at *app.js*. At the top of the file you will see this:

    var express = require('express');
    var path = require('path');
    var favicon = require('static-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    ...
    ...

These are dependency imports. The `require` function is **Node**'s way of
pulling in a package so that it can be used in another file. We will write a few
of our own later, but for now we just want to add one for our new dependency -
**socket.io**.

Add the following to the top of the *app.js* file:

    var socketIo = require('socket.io');

It doesn't really matter where you add it, but try to keep your `require`s in
some sort of logical order, it'll make it easier to find them later.

We then need to hook **socket.io** up with our **Express** app, which takes
two more lines of **JavaScript**:

    var server = require('http').Server(app);
    var io = socketIo(server);

Make sure you added these lines below where `app` is declared.

There's a few new things going on here:

* We are `require`ing the `'http'` package - where did it come from? HTTP requests
are a very important part of **Node** so it has a built in package for handling
them.

* We are accessing a value directly off the `require` - this makes sense when
you know that the result of a `require` is just a **JavaScript** object, and we can
do any of the normal things that we would with an object, like reading a property
of that object.

* We are passing the `app` object into HTTP.Server - this means we have to have
this code after `app` has been created.

* We are calling our previously `require`d `socketIo` variable as a function -
Even though we just said the result of a `require` is a **JS** object, functions
are just objects in **JavaScript** as well. It is quite common to see modules
that return functions.

___

### Making socket.io listen:

Now there is one other thing left to do, make **socket.io** listen on a port
for connections. This is just one more line of code, which needs to be added
after we declared our `server` and `io` variables:

    server.listen(8888);

This tells our server to listen for connections coming in on port 8888!

Try running your app now by running `npm start` again!

...

...

...

Uh oh. We've just come across our (hopefully) first error in **Node.js**! So
what happened? Well, we just told our server to listen on port 8888 right?

Take a look at the script in *bin/www* - the one that gets run when we do `npm
start`...

    var server = app.listen(app.get('port'), function ...

Huh. But we already told our server to listen. It can't listen to two things at
once, so it throws an error. Notice that **Node** completely crashed because of
this error on the main thread - we will talk later about how to deal with that
better.

For now, let's get rid of everything from the *bin/www* script except the two
`require` statements. When it's done, it should look like this:

    #!/usr/bin/env node
    var debug = require('debug')('Summer of Tech - node.js Bootcamp');
    var app = require('../app');

Then try running `npm start` again, and we should have no problems. Open your
browser to http://localhost:8888, and see that everything is still working.

Note that if you go back to your terminal, you can actually see the requests
that are being sent to your **Node** server are being logged out - this can be
useful for debugging.

___
### Client-side library:

Now that we have **socket.io** running away on our server, we can fetch the
client-side library from our web page. As well as listening to incoming requests
the **socket.io** server also hosts the client-side code needed to talk to it
at */socket.io/socket.io.js*.

Let's go take a look at the **Jade** file in *views/layout.jade*...

The **Jade** syntax can be a little bit confusing at first, but you should see
that it is a stripped down version of **HTML**. That's fine for what we need,
as we just want to add a `<script>` tag with a reference to our **socket.io**
code.

With client side JS, we don't want the browser to wait for the files to be
downloaded before rendering the page, so we add our `<script>` tag at the bottom,
below the `<body>`, like this:

    body
      block content
      script(src='/socket.io/socket.io.js')

Restart your app, and navigate to http://localhost:8888 again. Open up the dev
tools in whatever browser you're using, check the network tab and you should be
able to see that the request was made to *"socket.io/socket.io.js"*, and that a
**JavaScript** file was returned.

___

### Connecting the client and the server:

Now that we have the necessary dependencies on both our front-end and our
back-end, we can get them talking. This is a good excuse to look at how to use
**Express** to serve static assets. **Express** has a built-in piece of
*middleware* (we'll come back to more on that) called `express.static`, which
tells **Express** where to look for our static files. As we can see in
*app.js*, you use it something like this:

    app.use(express.static(path.join(__dirname, 'public')));

> Also note here the use of `path.join` - this is a platform independent way to
> create a file path that will work on both Windows and Unix systems.

This means that everything in the *public* directory will be served by
**Express** if you request it - no need to hand code static file routes.

Add a *client.js* file into the *javascripts* folder. Inside that file, add the
following JavaScript code:

    var socket = io.connect('http://localhost');
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', {
        my: 'data'
      });
    });

Now go back to the *views/layout.jade* file, and add another `<script>` tag
below the other one:

    script(src='/javascripts/client.js')

Restart your server, and open up your app in the browser. Check the network tab
again and see that your new script was loaded in - but it won't do anything yet.

We still need to do some stuff from the server-side.

Add the following to your *app.js* file, just above the `module.exports = app;`
line:

    io.on('connection', function (socket) {
      socket.emit('news', {
        hello: 'world'
      });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    });

Before you run the code, read it and try to guess what will happen. Then, once
again, restart your server and open up your app. This time something should
happen - was it what you expected?

Lets look back at the server-side code for a minute. Again, if you've done any
client-side **JavaScript**, you should notice a familiar pattern:

    something.on('some event', function () { ... });

This is a very common pattern in **JavaScript**, the idea of passing around
a function as a *callback*, which will happen at some later point. Functions are
[*first class citizens*][firstclass] in **JavaScript**, they can be passed around like any
other object, even have properties assigned to them. This is a very powerful
feature and allows **JavaScript** to act like a functional language if it wants
to.

Another feature of this part of code that is worth noting is it's use of a
[*closure*][closure]. Functions in **JavaScript** retain the scope (the context) from the
point where they were created. That means that within the event handler for
"my other event", we will have access to that specific `socket` because the
inner-function (the "my other event" handler) has access to the variables of the
outer-function (the "connection" handler):

    io.on('connection', function (socket) {
      socket.on('my other event', function (data) {
        // within this function we have access to the specific `socket` variable
        // even if another connection has occured.
      })
    });

We will look back at this again later.

Before we move on, play around with a few events of your own, try sending some
other kinds of data back and forward between the client and the server. When
you're ready, move on to step 3.

# STEP 3:

To update to this point, run:

    git checkout step-3

### Build processes with Node.js:

First things first, let's add a bit more sparkle to our UI. This is a great time
to introduce some of the other common tools that are used with **Node**. We
will take a quick look at [**gulp.js**][gulp].

**gulp** is used to create a build process by joining up tasks to do useful things,
such as compiling from other languages to JavaScript and CSS, running tests,
moving files around, and so on.

**gulp** is yet another **Node** package, so we will need to install it:

    npm install gulp --save-dev

Notice how this time, we have used the `--save-dev` flag. That means that we
have asked for this package to be saved to our *packages.json*, but that it is
not a run-time dependency - you only need it if you are developing on this
project.

A **gulp** build is defined in a *gulpfile.js*, so create that file at the root
of your project. Add the following to the file:

    var gulp = require('gulp');

    gulp.task('default', function() {
      console.log('I am the default gulp task.')
    });

To run **gulp** you also need to install it globally, so again we install with
**npm**:

    npm install -g gulp

> ### IMPORTANT!
> Again, the global install will fail if you don't have permissions to install
> packages globally on your machine. We can use the same hack from before to get
> it to work, since we already installed it locally.
>
> Change the "scripts" object in your *package.json* file to this:
>
>     "scripts": {
>       "start": "node ./bin/www",
>       "gulp": "gulp"
>     },
>
> If you had to do this step, note that whenever the instructions say to run
> `gulp`, you will need to do `npm run gulp` instead.

Let's try that out:

    gulp // (or npm run gulp)

If everything worked according to plan, we should have seen "I am the default
gulp task" logged to the console!

Now, let's do something actually useful with **gulp**.

### Transpiling client-side code:

A common thing to do these days, is to write our **JavaScript** and **CSS**
in another language, and then [*transpile*][transpile] that code to the
**JavaScript** and **CSS** that the browser expects. We're going to do that
here, and go from [**CoffeeScript**][cs] and [**SASS**][sass] to **JS** and
**CSS**.

Thankfully, **gulp** makes this easy!

First things first, we need to get the **CoffeeScript** and **SASS** source
files - take a look inside the *secret/* directory - I bet you already did...

Here we have our source **CoffeeScript** files - they will be compiled to
**JavaScript**. We also have our source **SASS** files - these will become
our **CSS**.

Just change the name of that folder from *'secret'* to *'client-src'*.

Next, we need to add some more dependencies. There are **gulp** plugins for
lots of common things that you might want to do - for example compile
**CoffeeScript** and **SCSS**.

     npm install gulp-coffee --save-dev
     npm install gulp-sass --save-dev

Again, these are only dev dependencies, so we save them in *package.json* with
`--save-dev`.

**gulp** performs build tasks based on another useful concept from **Node** -
[streams][streams]. Streams take data from one place and pipe it through some
process or to some other place.

First, let's look at how to use **gulp** and streams to compile **CoffeeScript**
to **JavaScript**. Add the following to the *gulpfile.js*:

    var coffee = require('gulp-coffee');

    gulp.task('coffee', function() {
      return gulp.src('./client-src/coffee/*.coffee')
        .pipe(coffee().on('error', function (err) { console.log(err); }))
        .pipe(gulp.dest('./public/javascripts/'));
    });

Let's break this down a bit:

* We have created a new task called `'coffee'`
* We call `gulp.src` and pass in a glob that selects all our **CoffeeScript**
files, which returns us a stream of those files.
* We pipe the stream into the `coffee` plugin, which will return another stream
of all the compiled files (We also attach a basic error handler in case
something goes wrong)
* We pipe the compiled files into the `gulp.dest`, which takes a path saying
where we want the files to end up.

Now let's do the same thing for our **SASS**:

    var sass = require('gulp-sass');

    gulp.task('sass', function () {
        return gulp.src('./client-src/sass/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./public/stylesheets/'));
    });

This again follows the same sort of pattern - grab the set of files with
`gulp.src`, pipe them through some process (`sass()`), and pipe them into a
`gulp.dest`.

Now let's change our default **gulp** task so that it runs both of our new
tasks:

    gulp.task('default', ['coffee', 'sass']);

Because these two tasks don't depend on each other, **gulp** will happily run
them both at the same time.

Try running `gulp` and then look in *public/javascripts/* and *public/stylesheets/*
to see that our new files got created.

We're going to cheat a bit for the **HTML** of our page, and just copy the
**index.jade** file from *secret/* (which should now be named *client-src/*)
into *views/*.

Start up your app again with `npm start`, and have a look at the basis of our
chat application. Feel free to play around with the **SASS** and
**CoffeeScript** to make it look however you want!

# STEP 4:

To update to this point, run:

    git checkout step-4

### Tidying up the back-end:

Now that our UI is set up and emitting events, we are almost ready to listen for
these events on the server-side, and handle them accordingly!

But first, we are going to clean up a few things that we don't need for now...

Delete the following things:

* The *public/images/* directory
* The *route/users.js* file
* The line in *app.js* that says `var users = require('./routes/users');`
* The line in *app.js* that says `app.use('/users', users);`
* The *"production error handler"* in *app.js*
  >     // production error handler
  >     // no stacktraces leaked to user
  >     app.use(function(err, req, res, next) {
  >        res.status(err.status || 500);
  >        res.render('error', {
  >            message: err.message,
  >            error: {}
  >        });
  >     });

___

### Seperating out our code:

Now we are going to add a directory called *sockets/*, and inside that, a file
called *index.js*. We are going to move all of our **socket.io** code from
*app.js* into this file.

Take the line that says `var socketIo = require('socket.io');` and put it at the
top of *sockets/index.js*.

Also move the line that says `var io = socketIo(server);`, and the following
chunk from *app.js* into *sockets/index.js*:

    io.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    });

Will this still work? Unfortunately, it's not quite as simple as that. You might
notice that in the *sockets/index.js* file, we use the `server` variable from
*app.js*. We don't have access to that in *sockets/index.js*, so we need to add
a bit more code.

First, we wrap all of the code in *sockets/index.js* in a function called
`init`, which takes an argument `server`. The `init` function should also return
the `io` object;

Then, we are going to export our `init` function from that file, by assigning it
to `module.exports`.

    module.exports = init;

What exactly is going on here? **Node.js** follows the
[CommonJS][commonjs] module pattern for declaring modules. `module.exports` lets
us declare what gets returned when another file `require`s this file.

Our *sockets/index.js* should now look something like this:

    var socketIo = require('socket.io');

    var init = function (server) {
      var io = socketIo(server);

      io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
          console.log(data);
        });
      });

      return io;
    };

    module.exports = init;

To get everything working again, we just need to add one line to our *app.js*:

    var io = require('./sockets')(server);

This goes where we previously initialised our **socket.io**, right after the
`server` is declared. Notice that we only have to refer to the *sockets*
directory - **Node** will automatically return the *index.js* file if one
exists.

Check that everything still works like it did before!

# STEP 5:

To update to this point, run:

    git checkout step-5

### Finally! Wiring up our real-time chat!

Once again, have a look in the *sockets/index.js* file. We still have our old,
gross event-listeners from when we first added **socket.io**. We need to fix
that!

One thing that we should add that is useful to have, is a single line that logs
to the console whenever a connection happens. This will be handy for debugging
as we go along. Rip our the old `'connection`' event handle code and replace it
with this:

    io.on('connection', function (socket) {
      console.log('a socket with id "' + socket.id + '" has connected');
    });

Restart your server and open the app in a few different browsers (or different
tabs in the same browser), watch the sockets connect.

### Watching for new chat users:

If you take a look in the *client-src/coffee/client.coffee* (or compiled
*public/javascripts/client.js*) files, you will see that the client emits an
event when a user selects their username - `'join-chat'`. We need to listen to
this on the server side. Let's add a handler that simply logs out any data we
get from that event.

Within your `'connection'` handler add the following:

    socket.on('join-chat', function (data) {
      console.log(data);
    });

It's important that the function is added *inside* the `'connection'` handler
because of the *closure* thing we talked about before - we want to always have
access to our specific `socket` that we care about at that point in time.

Spin up the server again, and join the chat by selecting a username. Look on in
amazement as the server prints out your username to the console! Neat!

But now we can do something actually useful with it - let's send your username to
all the other clients! Once again change the code inside the `'connection'`
handler to the following:

    socket.on('join-chat', function (data) {
      socket.broadcast.emit('user-joined', {
        username: data,
        time: Date.now()
      });
    });

Now we are going to respond to the information that someone has joined the chat
by creating our own event - a `'user-joined'` event. And we're going to do two
things.

1. We are going to use the `socket.broadcast.emit` function, which means it will
be sent to all other users (so not including the one who just joined).
2. We are going to wrap the data in an object, and attach the current timestamp.

Start the server again, and open the app in two broswers (or have someone else
point at your machine from theirs). You should start to see messages showing up
when people join the room.

### Watching for chat users leaving:

Let's do the same thing for when someone leaves the room.

Whenever a `socket` joins the room, we can just assign a `username` property to
the `socket`:

    socket.on('join-chat', function (data) {
      socket.username = data;
      // ...

Now we can create a listener for the `'disconnect'` event and handle it
appropriately:

    socket.on('disconnect', function () {
      io.sockets.emit('user-left', {
        username: socket.username,
        time: Date.now()
      });
    });

Notice how we use `io.sockets.emit` because we cannot emit an event on a socket
that is no longer connected. `io.sockets.emit` will send a message to all
connected sockets.

Because the user can also 'leave' by changing their username, we need to hook up
the same handler for the `'leave-chat'` event. I'll leave that one up to you.

Test out your new functionality in the app, by opening it up in several browsers,
then leaving from one of them!

### Sending messages:

Okay, now we are ready for the big one - sending actual messages to other users!

If you look in the client-side code again, you will see that a `'send-message`
event is emitted whenever a user sends a message (woah!). We need to listen to
that on the server-side and send a `'message-recieved'` event out to everyone!
Have a go for yourself before looking at how I've done it, but first a hint -
you'll want to send it back to the user who sent it, as a kind of confirmation
that the server recieved the message...

## SPOILERS AHEAD:

![Whatcha doin?](http://a.tgcdn.net/images/products/additional/large/1107_unicorn_head_mask_inuse.jpg)

## SPOILERZ!!

If you got something like this, you did good. Hopefully you had a look at the
client-side code and worked out what you needed to send for it all to work, and
if so, good work! You now have a pretty decent chat client where you can send
abusive messages to your friends!

    socket.on('send-message', function (data) {
      io.sockets.emit('message-recieved', {
        username: socket.username,
        time: Date.now(),
        message: data
      });
    });

# STEP 6:

To update to this point, run:

    git checkout step-6

Okay, so if you got this far you're doing pretty good. Let's add one last
feature to our chat - message history. **Node** is really good at writing files
as well! And since it can be a bit of a pain to set up databases and stuff,
that's how we are going to do it!

First, we are going to make another directory called *database/*, with a
*index.js* file inside.

This module is going to do two things - write to a **JSON** file, and read back
from that file, and it needs to expose that functionality to the outside world.
The outline of our module should look like this:

    var read = function () {

    };

    var write = function () {

    };

    module.exports = {
      read: read,
      write: write
    };

We know we are going to want to read and write files, so we need to add a
`require` at the top of our module:

    var fs = require('fs');

The File System module is another core **Node** module, so we don't need to
install it with **npm**, it's already there for us.

### Persisting messages:

Now let's make some little changes to our *sockets/index,js* file:

We need to `require` our new module, being careful to make the path relative
to the current file:

    var database = require('../database');

And modify our `'send-message'` handler to make a call to the `write` function:

    socket.on('send-message', function (data) {
      var message = {
        username: socket.username,
        time: Date.now(),
        message: data
      };
      database.write(message);
      io.sockets.emit('message-recieved', message);
    });

Now we need to flesh out our `write` function!

    var write = (function () {
      var toWrite = [];

      var writeToFile = function () {
        var dataToWrite = toWrite[0];
        fs.readFile('./database/history.json', function (err, data) {
          data = data == null ? [] : JSON.parse(data);
          data.push(dataToWrite);
          data = data.slice(Math.max(data.length - 25, 0));
          fs.writeFile('./database/history.json', JSON.stringify(data), function (err) {
            toWrite.shift();
            if (toWrite.length > 0) {
              writeToFile()
            }
          });
        });
      };

      return function (data) {
        toWrite.push(data);
        writeToFile();
      };
    })();

It's not particularly elegant (and certainly doesn't handle errors at all), but
it will do the trick for now! There are a few **JavaScript** tricks you may
not have seen before here - the big one is an [IIFE][iife]. Also there is a
ternary statement `boolean express ? something : somethingElse`, but these are
common in many languages. There is also the beginnings of what has come to be
known as ["callback hell"][callbackhell] - a common problem in **Node** apps,
which is often overcome by the use of [Promises][promises].

Run the app, and send a few messages, and you will see that the
*database/history.json* file gets written, and that it only stores the last 25
messages - a completely arbitrary number!


### Retrieving messages:

We are now going to add a way to retrieve this data from the client. We have
actually already written much of this ourselves, because we read the whole
*history.json* file out in order to keep it at 25 items long. So let's do a bit
of refactoring to pull out the common code.

* We can pull out the path to the file, and the number of messages we want to
save into constants.

* And we can pull out the part that reads the *history.json* file to make our
`read` function from earlier. The only issue with this is that the `fs.readFile`
is an asynchronous operation, so we need to pass it in a callback, which the
`read` function will call after it's been done.

Here's how the *databases/index.js* file looks after this refactoring:

    var fs = require('fs');

    var DATABASE_PATH = './database/history.json';
    var NUMBER_OF_MESSAGES_TO_SAVE = 25;

    var read = function (callback) {
      fs.readFile(DATABASE_PATH, function (err, data) {
        data = data == null ? [] : JSON.parse(data);
        callback(data);
      });
    };

    var write = (function () {
      var toWrite = [];

      var writeToFile = function () {
        var dataToWrite = toWrite[0];
        read(function (data) {
          data.push(dataToWrite);
          data = data.slice(Math.max(data.length - NUMBER_OF_MESSAGES_TO_SAVE, 0));
          fs.writeFile(DATABASE_PATH, JSON.stringify(data), function (err) {
            toWrite.shift();
            if (toWrite.length > 0) {
              writeToFile()
            }
          });
        });
      };

      return function (data) {
        toWrite.push(data);
        writeToFile();
      };
    })();

    module.exports = {
      read: read,
      write: write
    };

Now we need to add a endpoint to our *app.js* file, which will simply return the
contents of *history.json*.

First, we need to `require` our *database* module:

    var database = require('./database');

Then we add an **Express** style route for a **GET** request to '/history':

    // get history
    app.get('/history', function (req, res) {
      // ...
    });

This needs to be added to *app.js* **before** the error handlers, or all the
requests will hit the error handlers first. As you can see, this function gets
a `req` (request) object and a `res` (response) object. We want to attach the
contents of *history.json* to the repsonse object, and sent it back to the user.

That will look something like this:

    app.get('/history', function (req, res) {
      database.read(function (data) {
        res.send(data);
      });
    });

As you can see, we pass a function to the `database.read` function. This is the
callback, which will be executed after the *history.json* file has been read. It
will be pased the `data` from the file, which we then attach to the response!

Start your server again, and open the app, and send a whole bunch of message!
Then either refresh the page, or close the browser and open it again. The window
will be populated with the last 25 messages that were sent in the chat room!
Magic!

# FIN:

To update to this point, run:

    git checkout fin

That brings us to the end of the bootcamp, but feel free to keep working away at
this! There's a lot more stuff you can do, maybe you want to be able to send
private messages to a particular user, or maybe you want to send files, upload
photos, you name it! **Node.js** is an extremely powerful platform for making
web apps, and I hope you've enjoyed this brief dalliance with it!

[node]: 'http://nodejs.org/'
[learn]: http://learnxinyminutes.com/docs/javascript/
[reintro]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
[crockford]: http://yuiblog.com/crockford/
[eloquent]: http://eloquentjavascript.net/
[npm]: https://www.npmjs.org/
[express]: http://expressjs.com/
[jade]: http://jade-lang.com/
[WebSockets]: http://www.html5rocks.com/en/tutorials/websockets/basics/
[socket]: http://socket.io/
[semver]: http://semver.org/
[npmsemver]: https://www.npmjs.org/doc/misc/semver.html
[firstclass]: http://en.wikipedia.org/wiki/First-class_function
[closure]: http://en.wikipedia.org/wiki/Closure_(computer_programming)
[gulp]: http://gulpjs.com/
[streams]: http://nodejs.org/api/stream.html
[transpile]: http://en.wikipedia.org/wiki/Source-to-source_compiler
[cs]: http://coffeescript.org/
[sass]: http://sass-lang.com/
[commonjs]: http://wiki.commonjs.org/wiki/CommonJS
[iife]: http://benalman.com/news/2010/11/immediately-invoked-function-expression/
[callbackhell]: http://callbackhell.com/
[promises]: https://www.promisejs.org/
