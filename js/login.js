class Login {
  constructor() {
    // 给登录按钮,绑定点击事件
    Login.$('.login-w .over').addEventListener('click', this.clickFn.bind(this))
  }
  clickFn() {
    // console.log(location.search.split('=')[1]);
    // 获取页面中form表单
    let forms = document.forms[0].elements;
    // console.log(forms);
    let username = forms.uname.value;
    let password = forms.password.value
    // 判断是否为空
    if (!username || !password) {
      return layer.open({
        content: '请填写完整表单',
        btn: ['马上登录']
        // , yes: function (index, layero) {
        //   // 按钮【按钮一】的回调
        //   window.sessionStorage.setItem('page', 'rpwd')
        //   location.assign('./login.html')
        // }

      })
    }

    // console.log(username, password);
    // 注意要发送post请请求
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // xhr.setReuestHeader
    // 对参数进行编码
    let data = `username=${username}&password=${password}`;
    axios.post('http://localhost:8888/users/login', data)
      .then(res => {
        // console.log(data);
        let { status, data } = res;
        console.log(data);
        if (status == 200) { // 请求成功
          // 判断是否登录成功
          if (data.code == 1) {
            // token 是登录 的 标识符
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user.id);
            console.log(111);
            // 从哪里来,跳转到哪里去
            const page = window.sessionStorage.getItem('page')
            console.log(page);
            if (location.search.split('=')[1]) { location.assign(location.search.split('=')[1]) }
            else if (page && page != '[object Window]') {
              window.location.href = `./${page}.html`

            } else {
              window.location.href = './index.html'
            }
          } else {  // 登录失败,就提示输入错误
            layer.open({
              title: '登录提示'
              , content: '用户名或者密码输入错误'
            });
          }
        }



      })
  }

  static $(tag) {
    let res = document.querySelectorAll(tag)
    return res.length == 1 ? res[0] : res;
  }
}
new Login;