class Index {
    constructor() {
        this.testLogin()
        this.bindEve()

    }
    bindEve() {
        Index.$('.on1')[1].addEventListener('click', this.logoutFn.bind(this))
        Index.$('.on button')[1].addEventListener('click', this.logoutFn.bind(this))
    }
    logoutFn() {
        localStorage.setItem('token', '')
        localStorage.setItem('user_id', '');
        this.testLogin()
    }
    async testLogin() {
        const token = window.localStorage.getItem('token');
        const id = window.localStorage.getItem('user_id');
        console.log(Index.$('.off1')[1]);
        if (!token || !id) {
            Index.$('.on').classList.remove('active')
            Index.$('.off')[0].classList.add('active')
            Index.$('.off')[1].classList.add('active')
            Index.$('.on1')[0].classList.remove('active')
            Index.$('.on1')[1].classList.remove('active')
            Index.$('.off1')[0].classList.add('active')
            Index.$('.off1')[1].classList.add('active')
            return
        }
        axios.defaults.headers.common['authorization'] = token;
        // 必须设置内容的类型,默认是json格式,server 是处理不了
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // 数据必须以原生的方式拼接好
        // 如果用户登录,则加数据信息添加到购物车中
        let { data } = await axios.get('http://localhost:8888/users/info?' + `id=${id}`);
        console.log(data);
        if (data.code !== 1) {
            //实现登录注册的跳转
            Index.$('.on').classList.remove('active')
            Index.$('.off')[0].classList.add('active')
            Index.$('.off')[1].classList.add('active')
            Index.$('.on1')[0].classList.remove('active')
            Index.$('.on1')[1].classList.remove('active')
            Index.$('.off1')[0].classList.add('active')
            Index.$('.off1')[1].classList.add('active')
            return
        }
        Index.$('.on').firstElementChild.innerText = data.info.nickname
        Index.$('.on1')[0].innerText = data.info.nickname

    }

    static $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }

}

class Banner {
    ulLisObj = document.querySelectorAll('.t-img li');
    olLisObj = document.querySelectorAll('.banner_index li');
    prev = document.querySelector('.arrow-l');
    next = document.querySelector('.arrow-r');
    index = 0
    lastIndex = 0
    times = ''
    constructor() {
        this.picturecurrent()
        this.bindEve()
        this.autoPlay()
    }
    autoPlay() {
        this.times = setInterval(() => {
            this.ringtcheck()
        }, 2000)
    }
    bindEve() {
        this.next.addEventListener('click', this.ringtcheck.bind(this))
        this.prev.addEventListener('click', this.leftcheck.bind(this))
        this.ulLisObj[0].parentNode.onmouseover = () => {
            clearInterval(this.times)
        }
        this.ulLisObj[0].parentNode.onmouseout = () => {
            this.autoPlay()
        }
    }
    ringtcheck() {
        this.lastIndex = this.index

        this.index++

        if (this.index >= this.ulLisObj.length) this.index = 0

        this.change()
    }
    leftcheck() {
        this.lastIndex = this.index
        this.index--
        console.log(this.index);

        if (this.index <= -1) this.index = this.ulLisObj.length - 1
        this.change()
    }
    picturecurrent() {
        this.olLisObj.forEach((val, key) => {
            val.onclick = () => {
                this.lastIndex = this.index
                this.index = key
                this.change()
                console.log(key);
            }
        })
    }
    change() {
        this.olLisObj[this.lastIndex].className = '';
        this.ulLisObj[this.lastIndex].className = '';

        // 设置当前选中的图片和序列号
        this.olLisObj[this.index].className = 'ac';
        this.ulLisObj[this.index].className = 'ac';
    }
}
class Count {
    constructor() {
        this.rengder()
        setInterval(this.rengder, 1000)
    }
    rengder() {
         const countObj = document.querySelector('.hd_countdown')

        let nowDate = new Date()
        let h = nowDate.getHours()
        if (h % 2) h--
        let endTime = new Date()
        endTime.setHours(h + 2)
        endTime.setMinutes(0)
        endTime.setSeconds(0)
        let diff = (endTime - nowDate) / 1000
        // console.log(diff);
        let tmpH = parseInt(diff / 60 / 60)
        let tmpM = parseInt(diff / 60) % 60
        let tmpS = parseInt(diff) % 60
        // console.log(countObj);
        countObj.innerHTML = template('countdown-template', { h, tmpH, tmpM, tmpS })
       


    }

    static $$(tag) {
        return document.querySelector(tag)
    }
}

new Index
new Banner
new Count