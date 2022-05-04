class Self {

    constructor() {
        this.id = window.localStorage.getItem('user_id')
        this.testLogin()
        // this.bindEve()
    }
    bindEve() {
        Self.$$('.formBtn').addEventListener('click', this.formsubmitFn.bind(this))
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
        // axios.defaults.headers.common['authorization']=token
        // axios.defaults.headers['Content-Type']='application/x-www-gorm-urlencoded';
        // let param=`id=${id}`
        // let {data}=await axios.post('http://localhost:8888/users/update')
        console.log(data);
        if (data.code !== 1) {
            window.sessionStorage.setItem('page', self)
            window.location.href = './login.html'
            return
        }
        this.bindHtml(data)


    }
    bindHtml(res) {
        const { username, age, gender, nickname } = res.info
        Self.$$('.username').value = username
        Self.$$('.age').value = age
        Self.$$('.gender1').checked = (gender === "男" ? true : false)
        Self.$$('.gender2').checked = (gender === "女" ? true : false)
        Self.$$('.nickname').value = nickname
        console.log(Self.$$('.username2'));
        Self.$$('.username1').innerText = username
        Self.$$('.username2').innerText = `用户名:${username}`

    }
    static async updateUserInfo() {
        let that = this
        const age = Self.$$('.age').value
        const gender = Self.$$('.gender1').checked ? '男' : '女'
        const nick = Self.$$('.nickname').value
       let id = window.localStorage.getItem('user_id')
               const info = { id }
//如果有值 再往里加
        nick?info.nickname=nick:''
        age?info.age=age:''
        gender?info.gender=gender:''
        let param=Self.queryStringify(info)
     let data=   await axios.post('http://localhost:8888/users/update',param)
        console.log(data);
        if(data.cade===1){
            alert('修改信息成功')
            return
        }
    }
    static rpwdFn(){
        window.location.href='./rpwd.html'
    }
    static $$(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
    static queryStringify(obj) {
        let str = ''
        for (let k in obj) {
          str += `${k}=${obj[k]}&`
        }
        return str.slice(0, -1)
      }
}

new Self