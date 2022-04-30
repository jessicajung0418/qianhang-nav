// 目标一：实现新增功能，并且LOGO为首字母
// 目标二：保存用户数据
// 目标三：优化url，避免因用户复制的链接有很多后缀导致link显示太长。解决方法：使用正则，删除/及后面的内容
// 目标四：删除功能，其中要实现阻止跳转页面事件冒泡，不然点删除也会跳转页面而不是期望的删除事件
// 目标五：做PC端，会使用到@media
// 目标六：添加键盘事件：用户输入单个字母就打开与其logo相同字母的网站


const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)

// 保存数据--这个还没学，在算法与数据结构课程里                  
const hashMap = xObject || [
    { logo: 'X', url: 'https://xiedaimala.com'}, 
    // { logo: './zhihu.jpg', logoType: 'image', url: 'https://www.zhihu.com'},
    { logo: 'Z', url: 'https://www.zhihu.com'},
    { logo: 'M', url: 'https://developer.mozilla.org'}
]
const simplifyUrl = (url) => {
    return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '')     // 删除/及后面的内容
}

const render = () => {
    $siteList.find('li:not(.last)').remove()     // 不找最后一个li，并且把之前的li都删掉
    hashMap.forEach((node, index) => {
        // .close那里，关闭按钮一律不要用x，这里是老师为了偷懒，后期自己要进行优化
        // 添加链接时不要用a标签，会导致阻止冒泡失败
        const $li = $(`<li>
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                          <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div> 
            </li>`).insertBefore($lastLi)
            // 代替a标签，给li添加链接
            $li.on('click', () => {
                window.open(node.url)
            })
            // 阻止冒泡 以及 删除网站并重新渲染
            $li.on('click', '.close', (e) => {
                e.stopPropagation()
                hashMap.splice(index, 1)
                render()
            })
    })    
}
render();

$('.addButton') 
 .on('click', () => {
     // 用户输入自己想进入的网址
     let url = window.prompt('请问您要添加什么网站？')
    // 识别用户输入的网址链接格式是否正确 (这里是检查网址是否是http开头的，如果不是，那么自动补上)
    if(url.indexOf('http') !== 0) {
       url = 'https://' + url
    }
    console.log(url)
    // 实现功能：点击新增网站，会增加一个小方块，有自己的logo和链接等，并且logo是网站的首字母
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    })
    render()
})

window.onbeforeunload = () => {
    console.log('页面即将关闭')
    // localStorage只能存字符串
    const string = JSON.stringify(hashMap)
    // console.log(typeof hashMap)
    // console.log(hashMap)
    // console.log(typeof string)
    // console.log(string)
    // 在本地的存储里面设置一个x，它的值就是string
    localStorage.setItem('x', string)
}

// 监听键盘事件
$(document).on('keypress', (e) => {
    console.log(e.key)
    // const key = e.key 简写成下面的
    const {key} = e
    for(let i = 0; i < hashMap.length; i++) {
        if(hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
})
