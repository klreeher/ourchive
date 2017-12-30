[![Build Status](https://travis-ci.org/c-e-p/ourchive.svg?branch=travis-ci)](https://travis-ci.org/c-e-p/ourchive)

# ourchive

ourchive is a configurable, multi-media archive app. It grew out of a need for archival web apps that focus on browsability and searchability, and are able to be easily installed and maintained by a non-technical administrator.

<!-- MarkdownTOC -->

- [contributor guidelines](#contributor-guidelines)
    - [ways to contribute](#ways-to-contribute)
- [code of conduct](#code-of-conduct)
- [development process overview](#development-process-overview)
    - [how to make a pr](#how-to-make-a-pr)
    - [code style guide](#code-style-guide)
- [swagger spec](#swagger-spec)
- [how to develop on ourchive](#how-to-develop-on-ourchive)
    - [tus-server for file upload](#tus-server-for-file-upload)
    - [how to set up ourchive for local development](#how-to-set-up-ourchive-for-local-development)

<!-- /MarkdownTOC -->

<a name="contributor-guidelines"></a>
## contributor guidelines

<a name="ways-to-contribute"></a>
### ways to contribute

- USE THIS APP! spin up an archive, play around with it, and when you run into issues, please log them as [github issues]()! [good bug reporting guidelines](https://www.joelonsoftware.com/2000/11/08/painless-bug-tracking/)
- Submit a code fix for a bug. grab a bug out of the [issue tracker]() and fix that sucker! then make a pull request to the repo. [pull request guidelines]()
- Submit a new feature request [as a GitHub issue]().
- Work on a feature that's on the roadmap, or unassigned in [the release version]()! then make a pull request to the repo. [pull request guidelines]()
- Submit a unit test.
- Submit another unit test. Maybe even a ui test if you're feeling frisky!
- Tell others about these projects.

(ganked with love from [azure](https://azure.github.io/guidelines/))

<a name="code-of-conduct"></a>
## code of conduct

please see [the code of conduct and diversity statement](codeofconduct.md)

<a name="development-process-overview"></a>
## development process overview

we base our development process on the [successful git branching model](http://nvie.com/posts/a-successful-git-branching-model/). in short:

- default is always production ready
- dev is where the next release is being developed, and anything in dev is ready to be tested (this includes moving your issue to in test and having updated it with your implementation notes, etc!)
- feature branches are used to develop new features for the upcoming or a distant future release. this is where a dev works on a bug fix or a new feature. when you're done and ready to have your work tested, [make a pr]() to `dev`.

<a name="how-to-make-a-pr"></a>
### how to make a pr

- when your code is done, make a pr on github to merge your branch to `dev`
- @c-e-p or @klreeher will review your pull request and either merge or return the pr with requested changes

<a name="code-style-guide"></a>
### code style guide

[imp put your style guide here]

<a name="swagger-spec"></a>
## swagger spec

we provide a [swagger spec](https://swagger.io/docs/specification/2-0/paths-and-operations/) of our underlying apis so that they can be easily consumed into other applications. (please someone make a mobile app, we'll love you forever. *_*)

<a name="how-to-develop-on-ourchive"></a>
## how to develop on ourchive

**prerequisites**: python3, virtualenv

<a name="tus-server-for-file-upload"></a>
### tus-server for file upload
tus-server: bundle exec rackup -p 9292 -o 10.0.2.15 config.ru &

<a name="how-to-set-up-ourchive-for-local-development"></a>
### how to set up ourchive for local development

ensure commands to python (including pip) are pointing to python3

    virtualenv venv
    . venv/bin/activate
    pip install -r requirements.txt
    sudo npm install -g webpack; npm install

Then: open 2 terminal windows (or sessions/whatever) to `ourchive/react-flask`.

In the first: `python app.py`

In the second: `webpack --watch`

---

![Dream a bit bigger, darling.](inception-dream-bigger.gif)
=======