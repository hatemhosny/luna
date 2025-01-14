# Luna Json Editor

JSON editor.

## Demo

https://luna.liriliri.io/?path=/story/json-editor

## Install

Add the following script and style to your page.

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/luna-json-editor/luna-json-editor.css" />
<script src="//cdn.jsdelivr.net/npm/luna-json-editor/luna-json-editor.js"></script>
```

You can also get it on npm.

```bash
npm install luna-json-editor --save
```

```javascript
import 'luna-json-editor/luna-json-editor.css'
import LunaJsonEditor from 'luna-json-editor'
```

## Usage

```javascript
const container = document.getElementById('container')
const jsonEditor = new JsonEditor(container, {
  name: 'luna',  
  value: {
    a: true,
  },
  nameEditable: false,
})
jsonEditor.expand(true)
```

## Configuration

* name(string): Object name.
* showName(boolean): Show object name or not.
* nameEditable(boolean): Is name editable.
* valueEditable(boolean): Is value editable.
* enableDelete(boolean): Enable deletion.
* enableInsert(boolean): Enable insertion.

## Api

## expand(recursive: boolean): void

Expand object.