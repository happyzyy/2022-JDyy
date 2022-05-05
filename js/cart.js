class Cart {
  constructor() {
    this.checkLogin();
    this.bindEve();
  }
  // 绑定事件
  bindEve() {
    Cart.$$('.allgoods').addEventListener('click', this.distributeEve.bind(this));// 给全选按钮绑定事件
  }
  // 操作购物车页面,用户必须登录
  async checkLogin() {
    let token = localStorage.getItem('token')

    let userId = localStorage.getItem('user_id');

    // 两个id必须都有才能发送请求
    if (!userId || !token) {

      layer.open({
        content: '当前用户去登录',
        btn: ['马上登录', '继续浏览']
        , yes: function (index, layero) {
          // 按钮【按钮一】的回调
          window.sessionStorage.setItem('page', 'cart')
          location.assign('./login.html')
        }
        , btn2: function (index, layero) {
          //按钮【按钮二】的回调
          //return false 开启该代码可禁止点击该按钮关闭
          return
        }
      })
      throw new Error('还没有登录');
    }

    axios.defaults.headers.common['authorization'] = token;
    let { data, status, data: { cart } } = await axios.get('http://localhost:8888/cart/list?id=' + userId);
    // if (status == 200) {
    // 判断是否超过有效期,过期则跳转到登录页面
    if (data.code !== 1) {
      location.assign('./login.html?ReturnUrl=./cart.html')
      List.$$('.on1')[0].classList.remove('active')
      List.$$('.on1')[1].classList.remove('active')
      List.$$('.off1')[0].classList.add('active')
      List.$$('.off1')[1].classList.add('active')
    } console.log(data);
  
   
    this.getCartGoods(cart)
    
    Cart.$$('.on1')[0].href='./self.html'

  }
  // 获取购物车中的数据
  async getCartGoods(cart) {

    // 判断接口的状态
    let selectNum = 0, selectPrice = 0, selected = 0, sale_current = 0
    console.log(cart);

    cart.forEach(item => {
      if (item.is_select) {
        selected++
        selectNum += item.cart_number
        selectPrice += item.cart_number * item.current_price
        sale_current += item.cart_number * (item.price - item.current_price)
      }

    })
    Cart.$$('.allgoods').innerHTML = template('cart_template', { list: cart, selectNum, selectPrice, selected, sale_current })

  }
  async distributeEve({ target }) {
    //实现全选
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('user_id');
    this.userId = localStorage.getItem('user_id');
    // console.log(target);
    if (target.className === 'select_all') {
      // console.log(111);
      axios.defaults.headers.common['authorization'] = token;
      // 必须设置内容的类型,默认是json格式,server 是处理不了
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // 数据必须以原生的方式拼接好
      let param = `id=${userId}&type=${target.checked ? 1 : 0}`;
      // 如果用户登录,则加数据信息添加到购物车中
      let { data, status } = await axios.post('http://localhost:8888/cart/select/all', param);
      console.log(data, status);
      if (data.code !== 1) return location.assign('./login.html?ReturnUrl=./cart.html')
      this.checkLogtminsin()
      
    }
    // 判断是否有div1个class,是则点击的为删除按钮
    if (target.parentNode.classList.contains('del1')) {
      let that = this;
      let layerIndex = layer.confirm('你要残忍抛弃我吗?', {
        title: '删除提示'
      }, function () {
        const goodsId = target.dataset.id
        console.log(goodsId);

        let userId = localStorage.getItem('user_id');
        //发送ajax删除商品数据
        // console.log(id, userId);
        axios.defaults.headers.common['authorization'] = token;

        axios.get('http://localhost:8888/cart/remove?id=' + userId + '&goodsId=' + goodsId)
          .then(res => {
            let { data } = res;
            // console.log(data, status);
            if (data.code !== 1) return
            //  location.assign('./login.html?ReturnUrl=./cart.html')
            // 关闭确认框
            layer.close(layerIndex);
            // 提示删除成功
            layer.msg('商品删除成功');
            that.checkLogin()
          });
      })
    }
    //商品加
    if (target.classList.contains('plus')) {
      const goodsId = target.dataset.id
      // console.log(goodsId);
      const number = target.previousElementSibling.value - 0 + 1
      let userId = localStorage.getItem('user_id');
      // console.log(id, userId);
      axios.defaults.headers.common['authorization'] = token;
      let param = `id=${userId}&goodsId=${goodsId}&number=${number}`;
      // 如果用户登录,则加数据信息添加到购物车中
      await axios.post('http://localhost:8888/cart/number', param)
        .then(res => {
          // console.log(res);
          let { data } = res;
          console.log(data);
          if (data.code !== 1) return
          this.checkLogin()
        })
    }
    if (target.classList.contains('mins')) {
      const goodsId = target.dataset.id
      const number = target.nextElementSibling.value - 0 - 1
      let userId = localStorage.getItem('user_id');
      // console.log(id, userId);
      // console.log(number)

      axios.defaults.headers.common['authorization'] = token;
      let param = `id=${userId}&goodsId=${goodsId}&number=${number}`;
      // 如果用户登录,则加数据信息添加到购物车中
      await axios.post('http://localhost:8888/cart/number', param)
        .then(res => {
          // console.log(res);
          let { data } = res;
          // console.log(data, status);
          if (data.code !== 1) return
          this.checkLogin()
        })
    }

    // 判断点击是否为单个商品的选中按钮
    if (target.classList.contains('good-checkbox')) {
      // console.log(target);
      const goodsId = target.dataset.id
      axios.defaults.headers.common['authorization'] = token;
      let param = `id=${this.userId}&goodsId=${goodsId}`;
      // 如果用户登录,则加数据信息添加到购物车中
      await axios.post('http://localhost:8888/cart/select', param)
        .then(({ data }) => {
          if (data.code !== 1) return
          this.checkLogin()
        })
    }
    if (target.classList.contains('sum-btn')) {
      const goodsId = target.dataset.id
      axios.defaults.headers.common['authorization'] = token;
      let param = `id=${this.userId}`;
      // 如果用户登录,则加数据信息添加到购物车中
      await axios.post('http://localhost:8888/cart/select', param)
        .then(({ data }) => {
          if (data.code !== 1) return
         location.href='./pay.html'

        })
    }
  }

  // 获取页面中,所有选中商品的价格和数量
  
    
    // console.log(totalNum, totalPrice);
    // 设置到总计上
    

  static detailFn(){
    location.href='./detail.html'
  }



 
  static $$(ele) {
    let res = document.querySelectorAll(ele);
    return res.length == 1 ? res[0] : res;
  }
}

new Cart();