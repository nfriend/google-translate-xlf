
![XLF2XLF](./logo.png)

# XLF2XLF (ex. google-translate-xlf)
A command-line utility to automatically translate .xlf translation files using Google Translate

**DISCLAIMER**

> This library was forked from https://github.com/nfriend/google-translate-xlf

> Some additions to package dependecies were made according to https://www.npmjs.com/package/google-translate-xlf-updated

The main goal to fork and edit original tool was to preserve word and interpolation blocks order while translating original _.xlf_ file, as base library copied this interpolation blocks to the end of _target_ element.

While making this improvements, the original _translate.js_ file eas fully rewritten starting from library we are using to read and build object model of _.xlf_ to ending with how we are parsing object model tree itself and creating queue to translate. 

Also most of redundant dependecies were removed, file and folder structure were redefined.

## Installation

This is a command-line utility.  To install this utility, run:

```bash
npm install -g xlf2xlf
```

This will install the utility globally so that it can be run from any location. The executable installed by this module is `xlf2xlf`.

## Usage

Before you begin, you will need an `.xlf` file to translate!

If you are using [Angular 2+](https://angular.io/) and the [Angular CLI](https://cli.angular.io/), you will probably extract an `.xlf` file from your app by [running `ng xi18n` inside your Angular project](https://angular.io/guide/i18n#create-a-translation-source-file-with-ng-xi18n).  This produces a file named `messages.xlf` inside your project folder.

Say we have an `.xlf` file named `messages.xlf`.  Let's translate this file from English ("en") to Hindi ("hi") and save the translated file as `messages.hi.xlf`:

```bash
xlf2xlf --in messages.xlf --out messages.hi.xlf --from en --to hi
```

Or, if you don't like typing, you can use the abbreviated versions of the arguments:

```bash
xlf2xlf -i messages.xlf -o messages.hi.xlf -f en -t nl
```

For more usage help, run:

```bash
xlf2xlf help
```

By default, a comment is prepended to the output file that looks like this:

```xml
<!--  Translated on July 1 2020, 10:47:39 by xlf2xlf: https://github.com/chekit/xlf2xlf -->
```

This behavior can be turned off by passing `--comment false`.

## Developing

The easiest way to develop on this module is to use test-driven development.

Unit tests can be run with `npm test`.  To automatically re-run the tests when you make changes to the files, run `npm run test:watch`.

## Translation

This utility uses Google Translate's online API for its translations using this NPM package: https://www.npmjs.com/package/@k3rn31p4nic/google-translate-api
