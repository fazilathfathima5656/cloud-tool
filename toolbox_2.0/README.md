

## Directory Structure

ToolBox is split up in different modules which are all in a single mono repository.

The most important directories:

 - [/docker/image](/docker/image) - Dockerfiles to create ToolBox containers
 - [/docker/compose](/docker/compose) - Examples Docker Setups
 - [/packages](/packages) - The different ToolBox modules
 - [/packages/cli](/packages/cli) - CLI code to run front- & backend
 - [/packages/core](/packages/core) - Core code which handles workflow
                                      execution, active webhooks and
                                      workflows
 - [/packages/editor-ui](/packages/editor-ui) - Vue frontend workflow editor
 - [/packages/node-dev](/packages/node-dev) - CLI to create new ToolBox-nodes
 - [/packages/nodes-base](/packages/nodes-base) - Base ToolBox nodes
 - [/packages/workflow](/packages/workflow) - Workflow code with interfaces which
                                            get used by front- & backend


## Development Setup

If you want to change or extend ToolBox you have to make sure that all needed
dependencies are installed and the packages get linked correctly. Here a short guide on how that can be done:


### Requirements


#### Build Tools

The packages which ToolBox uses depend on a few build tools:

Linux:
```
apt-get install -y build-essential python
```

Windows:
```
npm install -g windows-build-tools
```

#### lerna

ToolBox is split up in different modules which are all in a single mono repository.
To facilitate those modules management, [lerna](https://lerna.js.org) gets
used. It automatically sets up file-links between modules which depend on each
other.

So for the setup to work correctly lerna has to be installed globally like this:

```
npm install -g lerna
```


### Actual ToolBox setup

> **IMPORTANT**: All the steps bellow have to get executed at least once to get the development setup up and running!


Now that everything ToolBox requires to run is installed the actual ToolBox code can be
checked out and set up:

1. Clone the repository
	```
	git clone git@gitlab.com:maninder_221/toolbox_2.0.git
	```

1. Go into repository folder
	```
	cd toolbox_2.0
	```

1. Install all dependencies of all modules and link them together:
	```
	lerna bootstrap --hoist
	```

1. Build all the code:
	```
	npm run build
	```



### Start

To start ToolBox execute:

```
npm run start
```


## Development Cycle

While iterating on ToolBox modules code, you can run `npm run dev`. It will then
automatically build your code, restart the backend and refresh the frontend
(editor-ui) on every change you make.

1. Start ToolBox in development mode:
	```
	npm run dev
	```
1. hack, hack, hack
1. Check if everything still runs in production mode
	```
	npm run build
	npm run start
	```
1. Create tests
1. Run all tests
	```
	npm run test
	```
1. Commit code and create pull request


### Test suite

The tests can be started via:
```
npm run test
```

If that gets executed in one of the package folders it will only run the tests
of this package. If it gets executed in the ToolBox-root folder it will run all
tests of all packages.