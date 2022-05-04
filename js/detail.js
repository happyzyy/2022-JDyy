class Detail {
    constructor() {
        this.getGoodsInfo()

    }
    async getGoodsInfo() {
        const goods_id = window.sessionStorage.getItem('goods_id')
        // if (!goods_id) return window.location.href = './list.html'

        const { data } = await axios.get('http://localhost:8888/goods/item?' + `id=${goods_id}`)

        console.log(data);
        //  if()
        if (data.code !== 1) return window.location.href = './list.html'
        const contentBox = document.querySelector('.de_container')
        contentBox.innerHTML = template('detail_temlate', data)
        this.enlarge()
    }
    enlarge() {

        //获取show 盒子  mask盒子 enlarge盒子 尺寸

        this.show_width = Detail.$$('.preview_img>img').clientWidth
        this.show_height = Detail.$$('.preview_img>img').clientHeight
        this.mask_width = parseInt(window.getComputedStyle(Detail.$$('.mask')).width)
        this.mask_height = parseInt(window.getComputedStyle(Detail.$$('.mask')).height)
        this.bg_width = parseInt(window.getComputedStyle(Detail.$$('.bigimg')).width)
        this.bg_height = parseInt(window.getComputedStyle(Detail.$$('.bigimg')).height)
        this.enlarge_width = 0
        this.enlarge_height = 0
        this.setScale()
        this.listchage()
        this.bindEve()
        this.move()

        // var movar 
    }
    setScale() {
        this.enlarge_width = this.bg_width * this.mask_width / this.show_width
        this.enlarge_height = this.bg_height * this.mask_height / this.show_height
        console.log(this.bg_height,this.mask_height,this.show_height);
        Detail.$$('.big').style.width = this.enlarge_width + 'px'
        Detail.$$('.big').style.height = this.enlarge_height + 'px'

    }
    listchage() {
        Detail.$$('.list_item img').forEach((item) => {
            item.onclick = function (e) {
                for (var i = 0; i < Detail.$$('.list_item>li').length; i++) {
                    Detail.$$('.list_item img')[i].parentElement.classList.remove('current')
                }
                e.target.parentElement.classList.add('current')
                var show_url = e.target.dataset.show
                console.log(show_url);
                Detail.$$('.preview_img').firstElementChild.src = show_url
                Detail.$$('.big').firstElementChild.src = show_url
            }
        })
    }
    bindEve() {
        Detail.$$('.preview_img>img').onmouseover = function () {
            Detail.$$('.mask').style.display = 'block'
            Detail.$$('.big').style.display = 'block'
        }
        Detail.$$('.preview_img>img').onmouseout = function () {
            Detail.$$('.mask').style.display = 'none'
            Detail.$$('.big').style.display = 'none'
        }
    }
    move() {
        Detail.$$('.preview_img').onmousemove = (e) => {
            var x = e.offsetX - this.mask_width / 2
            var y = e.offsetY - this.mask_height / 2
            // console.log(this.mask_height, x, y);
            //边界值判断
            if (x <= 0) x = 0
            if (y <= 0) y = 0
            if (x > this.show_width - this.mask_width)  x = this.show_width - this.mask_width
            if (y > this.show_height - this.mask_height)  y = this.show_height - this.mask_height
            //给mask赋值 让遮罩层移动
            Detail.$$('.mask').style.left = x + 'px'
            Detail.$$('.mask').style.top = y + 'px'
            //按照固定的公式计算一个背景图片的移动尺寸
            var bg_x = x * this.enlarge_width / this.mask_width * -1
            var bg_y = y * this.enlarge_height / this.mask_height * -1

            Detail.$$('.bigimg').style.left = bg_x + 'px'
            Detail.$$('.bigimg').style.top = bg_y + 'px'
            console.log(this.enlarge_height, bg_y);


        }


    }
    static $$(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
}
new Detail