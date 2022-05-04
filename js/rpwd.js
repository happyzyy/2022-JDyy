class Rpwd {
    constructor() {
        this.id = window.localStorage.getItem('user_id')
        this.bindEve()
    }
    bindEve() {
        Rpwd.$$('.btn-xl').addEventListener('click', this.rpwdsubbmitFn.bind(this))
    }
    async rpwdsubbmitFn(e) {
        const token = window.localStorage.getItem('token')

        const oldpwd = Rpwd.$$('.oldpwd').value
        const newpwd = Rpwd.$$('.newpwd').value
        const rpwd = Rpwd.$$('.rnewpwd').value
        if (!oldpwd || !newpwd || !rpwd) return alert('请填写完整表单')
        if (newpwd !== rpwd) return alert('两次密码不一致')
        console.log('发送骑牛');
        axios.defaults.headers.common['authorization'] = token
        let param = `id=${this.id}&oldPassword=${oldpwd}&newPassword=${newpwd}&rNewPassword=${rpwd}`
        let { data } = await axios.post('http://localhost:8888/users/rpwd', param)
        console.log(data, 1111);
        if (data.code !== 1) {
            if(data.code===0) return alert('原始密码错误')
            layer.open({
                content: '当前用户未登录',
                btn: ['马上登录']
                , yes: function (index, layero) {
                    // 按钮【按钮一】的回调
                    window.sessionStorage.setItem('page', 'rpwd')
                    location.assign('./login.html')
                    // return
                }
            })
            return
        }
        window.sessionStorage.removeItem('page')
        alert('恭喜,修改密码成功,以自动注销状态,点击确定重新登录')
window.location.href='./login.html'
    }
    async testLogin() {
            const token = window.localStorage.getItem('token')
            if (!token || !this.id) {
                window.sessionStorage.setItem('page', 'self')
                window.location.href = './login.html'
                return
            }
            axios.defaults.headers.common['authorization'] = token;
            // 必须设置内容的类型,默认是json格式,server 是处理不了
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            let { data } = await axios.get('http://localhost:8888/users/info?' + `id=${this.id}`);

            console.log(data);
            if (data.code !== 1) {
                window.sessionStorage.setItem('page', self)
                window.location.href = './login.html'
                return
            }


        }
    static $$(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
} new Rpwd