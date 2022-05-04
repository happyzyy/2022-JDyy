class Register {

    constructor() {
        this.formsubmit()

    }
    formsubmit() {
        const form = document.forms[0]
        console.log(form.tel);
        form.addEventListener('submit', async e => {
            e.preventDefault()
            const name = form.tel.value
            const pwd = form.psw.value
            const rpwd = form.repsw.value
            const nick = form.nickname.value
            if (!name || !pwd || !rpwd || !nick) return alert('请填写完整表单')
            if (pwd !== rpwd) return alert('两次密码不一致')
            // 必须设置内容的类型,默认是json格式,server 是处理不了
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            // 数据必须以原生的方式拼接好
            let param = `username=${name}&password=${pwd}&rpassword=${rpwd}&nickname=${nick}`;
            // 如果用户登录,则加数据信息添加到购物车中
            let { data } = await axios.post('http://localhost:8888/users/register', param);
            console.log(data.code);
            if (data.code === 1) {
                window.location.href = './login.html'
            } else {
                layer.open({
                    content: '注册失败:'+data.message,
                    btn: ['重新注册']

                })
                return
            }
        })
    }
    static $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res
    }
}
new Register