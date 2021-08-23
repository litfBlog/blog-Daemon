# Hi! 这里是首页

::: tip 我是提示
hello
:::

[123](./#/pages/qwq)

```js
import Vue from 'vue'
import axios from 'axios'
axios({
  methods: 'POST',
  url: '/login',
  data: {
    username: 'admin',
    passworld: '123456'
  }
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

```js
while (true) {
  console.log('你好')
}
```
