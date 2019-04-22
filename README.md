# edit-dns [![Build Status](https://travis-ci.com/jafri/edit-dns.svg?branch=master)](https://travis-ci.com/jafri/edit-dns)

> 0-dependancy TS library to load, save and recover DNS files

[Docs](https://jafri.github.io/edit-dns/)

## Install
NPM
```
npm i edit-dns
```

Yarn
```
yarn add edit-dns
```

## Usage

```js
import DnsEditor from 'edit-dns'

(async () => {
    // Saves current DNS settings
    await DnsEditor.save()

    // Load new DNS settings
    await DnsEditor.load(['1.1.1.1'])

    // Check DNS entry exists
    console.log(await DnsEditor.exists('1.1.1.1')) // true

    // Recover saved settings
    await DnsEditor.recover()

    // Check DNS entry does not exist
    console.log(await DnsEditor.exists('1.1.1.1')) // false
})()
```
