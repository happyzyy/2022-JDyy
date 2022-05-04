class List {
  constructor() {
    // 等待promise 对象解包完成'
    this.goods_info = {
      current: 1, pagesize: 12, search: '', saleType: 10, sortType: 'id', srotMethod: ' ASC', category: ''
    }
    // 给属性赋值,调用其它方法
    this.getCateList()
    this.getData();
    this.bindEve()
  }
  bindEve() {
    // 分页栏的点击事件
    List.$$('.filterBox').addEventListener('click', this.categoryFn.bind(this))
    // 将加入购物车使用事件委托
    List.$$('.goods_list').addEventListener('click', this.addCartFn.bind(this))
    //分页栏搜索框
    List.$$('.search_inp').addEventListener('input', this.searchFn.bind(this))
    //分页栏一页分几个商品的改变事件
    List.$$('.filterBox').addEventListener('change', this.sectionchangeFn.bind(this))
  }
  sectionchangeFn(e) {
    if (e.target.nodeName !== 'SELECT') return
    this.goods_info.pagesize = e.target.value - 0
    this.goods_info.current = 1
    this.getData()
  }
  searchFn(e) {
    this.goods_info.search = e.target.value.trim()
    this.goods_info.current = 1
    this.getData()

  }
  categoryFn(e) {
    const t = e.target;
    if (t.className === 'cate') {
      // console.log(t.parentElement);
      // console.log(t.parentNode);
      ;[...t.parentElement.children].forEach(item => {
        item.classList.remove('active')
      })
      t.classList.add('active')
      this.goods_info.category = t.dataset.index
      // console.log(this.goods_info.category);
      // console.log(this.goods_info );
      this.goods_info.current = 1
      this.getData()
    }
    if (t.className === 'sale') {
      // console.log(t.parentElement);
      // console.log(t.parentNode);
      ;[...t.parentElement.children].forEach(item => {
        item.classList.remove('active')
      })
      t.classList.add('active')
      this.goods_info.saleType = t.dataset.index
      this.goods_info.current = 1

      this.getData()
    }
    if (t.className === 'sale') {
      // console.log(t.parentElement);
      // console.log(t.parentNode);
      ;[...t.parentElement.children].forEach(item => {
        item.classList.remove('active')
      })
      t.classList.add('active')
      this.goods_info.saleType = t.dataset.index
      this.goods_info.current = 1

      this.getData()

    }
    if (t.className === 'sort') {
      // console.log(t.parentElement);
      // console.log(t.parentNode);
      ;[...t.parentElement.children].forEach(item => {
        item.classList.remove('active')
      })
      t.classList.add('active')
      this.goods_info.sortType = t.dataset.type
      this.goods_info.sortMethod = t.dataset.method
      this.getData()

    }
    if (t.className === 'prev') {
      this.goods_info.current--
      this.getData()
    }
    if (t.className === 'next') {
      this.goods_info.current++
      this.getData()
    }
    if (t.className === 'go') {
      let current = t.previousElementSibling.value - 0
      const total = t.dataset.total - 0
      if (isNaN(current)) current = 1
      current = parseInt(current)
      if (current <= 1) current = 1
      if (current >= total) current = total
      this.goods_info.current = current

      this.getData()

    }




  }
  //列表页渲染
  async getCateList() {
    let { data: { list, code } } = await axios.get('http://localhost:8888/goods/category')

    // console.log(list);

    if (code !== 1) throw new Error('列表获取失败')

    List.$$('.cat_box>ul').innerHTML = list.reduce((prev, item) => {
      return prev + `<li class="cate" data-index="${item}">${item}</li>`
    }, `  <li class="active cate" data-index="">全部</li>`)

  }
  // 获取数据的方法
  async getData() {

    console.log(this.goods_info);
    let goods_info = List.queryStringify(this.goods_info)
    let { data: { total, yourParams, code, list } } = await axios.get('http://localhost:8888/goods/list?' + goods_info)
    // console.log(list, total, yourParams);
    //判断返回值的状态,追加数据
    if (code !== 1) { return console.log('无服务器'); }
    // console.log(data);
    List.$$('.pagi_box').innerHTML = template('pagi_template', { pagesize: yourParams.pagesize, current: yourParams.current, total: total })
    List.$$('.goods_list').innerHTML = template('list_template', { list: list })


  }

  // 加入购物车的方法
  async addCartFn(eve) {
    //跳转详情页
    if (eve.target.classList.contains('sk_goods') || eve.target.nodeName === 'LI') {
      console.log(eve.target);
      let goods_id = eve.target.dataset.id
      window.sessionStorage.setItem('goods_id', goods_id)
      window.location.href = './detail.html'
      console.log('跳转详情页')
      return
    }
    // console.log(this);
    // console.log(eve.target);
    // 判断用户是否登录,如果能够获取到token,则表示登录,获取不到表示未登录
    let token = localStorage.getItem('token')
    // 跳转
    if (!token) location.assign('./login.html?ReturnUrl=./list.html')

    // 判断是否点击的是a标签
    if (eve.target.className === 'sk_goods_buy') {
      // 商品id或用户id获取
      const goodsId = eve.target.dataset.id
      console.log(goodsId);
      let userId = localStorage.getItem('user_id');

      // 两个id必须都有才能发送请求
      if (!userId || !goodsId || !token) {

        layer.open({
          content: '当前用户去登录',
          btn: ['马上登录', '继续浏览']
          , yes: function (index, layero) {
            // 按钮【按钮一】的回调
            window.sessionStorage.setItem('page', 'rpwd')
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
      // 必须设置内容的类型,默认是json格式,server 是处理不了
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // 数据必须以原生的方式拼接好
      // 如果用户登录,则加数据信息添加到购物车中
      let { data, status, data: { code } } = await axios.get('http://localhost:8888/users/info?' + `id=${userId}`);
  let data1=data
      if (status == 200) {
        console.log(data1);
        console.log(code);
        if (code !== 1) {
           //实现登录注册的跳转
          
           List.$$('.on1')[0].classList.remove('active')
           List.$$('.on1')[1].classList.remove('active')
           List.$$('.off1')[0].classList.add('active')
           List.$$('.off1')[1].classList.add('active')
           

          layer.open({
            content: '当前用户未登录',
            btn: ['马上登录', '继续浏览']
            , yes: function (index, layero) {
              // 按钮【按钮一】的回调
              window.sessionStorage.setItem('page', 'list')
              location.assign('./login.html')
            }
            , btn2: function (index, layero) {
              //按钮【按钮二】的回调
              //return false 开启该代码可禁止点击该按钮关闭
              return
            }
           
          })
          return
        }
        List.$$('.on1')[0].innerText = data1.info.nickname
        List.$$('.on1')[0].href='./self.html'


        axios.defaults.headers.common['authorization'] = token;
        // 必须设置内容的类型,默认是json格式,server 是处理不了
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // 数据必须以原生的方式拼接好
        let param = `id=${userId}&goodsId=${goodsId}`;
        // 如果用户登录,则加数据信息添加到购物车中
        let { data, status } = await axios.post('http://localhost:8888/cart/add', param);
        // console.log(data);
        if (status == 200) {
          // console.log(data);
          console.log(data.code);
          if (data.code !== 1) {

            layer.open({
              content: '当前用户未登录',
              btn: ['马上登录', '继续浏览']
              , yes: function (index, layero) {
                // 按钮【按钮一】的回调
                location.assign('./login.html')
              }
              , btn2: function (index, layero) {
                //按钮【按钮二】的回调
                //return false 开启该代码可禁止点击该按钮关闭
                return
              }

            })
            return
          }
          //实现库存限量 
          await axios.get('http://localhost:8888/cart/list?' + `id=${userId}`)
            .then(res => {

              const { data: { cart, code } } = res
              if (code !== 1) return alert('获取库存数量失败,刷新后重进')

              let res1 = cart.some((val, index) => {
                console.log(val.cart_number);
                if (goodsId == val.goods_id) {
                  return val.cart_number >= val.goods_number


                }

              }

              )
              if (res1) {
                layer.open({
                  content: '库存不足,选择其他商品',
                  btn: ['选择其他商品']

                  , btn2: function (index, layero) {
                    //按钮【按钮二】的回调
                    //return false 开启该代码可禁止点击该按钮关闭
                  }
                })
                return
              }
              layer.open({
                content: '加入购物成功',
                btn: ['去购物车结算', '留在当前页面']
                , yes: function (index, layero) {
                  // 按钮【按钮一】的回调
                  location.assign('./cart.html')
                }
                , btn2: function (index, layero) {
                  //按钮【按钮二】的回调
                  //return false 开启该代码可禁止点击该按钮关闭
                }
              })
            })
        }
      }
    }
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

new List