# edit-dns [![Build Status](https://travis-ci.com/jafri/edit-dns.svg?branch=master)](https://travis-ci.com/jafri/edit-dns)

> TS library to load, save and recover DNS files

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

const dnsEditor = new DnsEditor('TestApp')

(async () => {
    // Saves current DNS settings
    await dnsEditor.save()

    // Load new DNS settings
    await dnsEditor.load(['1.1.1.1'])

    // Check DNS entry exists
    console.log(await dnsEditor.exists('1.1.1.1')) // true

    // Recover saved settings
    await dnsEditor.recover()

    // Check DNS entry does not exist
    console.log(await dnsEditor.exists('1.1.1.1')) // false
})()
```
