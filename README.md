# mv-utils

mv-utils is a Node.js package.

## Installation

```
npm install -g martinveverka/utils
```

## Usage

Import .ssh/config file.
```
mv-utils pull-ssh-config
```

Export .ssh/config file.
```
mv-utils push-ssh-config
```

## Configuration

This package is using [rc](https://www.npmjs.com/package/rc) for configuration,
so the same options can be set with command line arguments and config files.
Configuration files can be in INI or JSON format and
[can be placed at different locations](https://www.npmjs.com/package/rc#standards).

Most commonly you would place a `.mvutilsrc` file in your home directory,
and it can look like this:

```ini
; ssh config repository (Dropbox, OneDrive, etc.)
ssh-config-remote = ~/Dropbox/ssh-config

; your ssh config
ssh-config-local = ~/.ssh/config

; identity file to be included in ssh config, empty to skip
ssh-config-identity-file = ~/.ssh/id_rsa
```
