# google-translate-xlf
A command-line utility to automatically translate .xlf translation files using Google Translate

## Installation

This is a command-line utility.  To install this utility, run:

```bash
npm install -g google-translate-xlf
```

This will install the utility globally so that it can be run from any location.  The executable installed by this module is `translate-xlf`.

## Usage

Before you begin, you will need an `.xlf` file to translate! If you are using [Angular 2+](https://angular.io/) and the [Angular CLI](https://cli.angular.io/), you will probably extract an `.xlf` file from your app by [running `ng xi18n` inside your Angular project](https://angular.io/guide/i18n#create-a-translation-source-file-with-ng-xi18n).  This produces a file named `messages.xlf` inside your project folder.

Say we have an `.xlf` file named `messages.xlf`.  Let's translate this file from English ("en") to Hindi ("hi") and save the translated file as `messages.hi.xlf`:

```bash
translate-xlf --in messages.xlf --out messages.hi.xlf --from en --to hi
```

Or, if you don't like typing, you can use the abbreviated versions of the arguments:

```bash
translate-xlf -i messages.xlf -o messages.hi.xlf -f en -t hi
```

For more usage help, run:

```bash
translate-xlf help
```

By default, a comment is prepended to the output file that looks like this:

```xml
<!-- Translated on May 15th 2018, 5:01:18 pm by google-translate-xlf: https://github.com/nfriend/google-translate-xlf -->
```

This behavior can be turned off by passing `--comment false`.

## Caveats

This utility will **not** attempt to translate complex `<source>` values, like this:

```xml
<source>{VAR_SELECT, select, male {male} female {female} other {other} }</source>
```

In this case, the utility will simply copy this element and rename it to `<target>`.  

If this utility encounters something like this:

```xml
<source>The author is <x id="ICU" equiv-text="{gender, select, male {...} female {...} other {...}}"/></source>
```

_only_ "The author is" will be translated.

It hopefully goes without saying that the translations produced by this utility will be far from perfect. The intention of this utility is to provide a very rough translation for development purposes.

## Developing

The easiest way to develop on this module is to use test-driven development.  Unit tests can be run with `npm test`.  To automatically re-run the tests when you make changes to the files, run `npm run test:watch`.

## Translation

This utility uses Google Translate's online API for its translations using this NPM package: https://www.npmjs.com/package/google-translate-api.
