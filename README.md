# edit-dns

> 0-dependancy TS library to load, save and recover DNS files

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

    // Recover saved settings
    await DnsEditor.recover()
})()
```
