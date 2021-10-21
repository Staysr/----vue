<template>
	<div class="navbar_main">
		<!-- 导航栏左边部分 -->
		<div class="nav_left">
		</div>

		<!-- 导航栏中间区域 -->
		<div class="nav_center">
			<div class="nav_center_search" v-if="searchExist"  ref="NavSearch">
				<!-- 输入框 -->
				<el-autocomplete class="search_inp" popper-class="my-autocomplete" v-model="searchData"
					:placeholder="searchDefaults" :fetch-suggestions="querySearch" :trigger-on-focus="false"
					@select="handleSelect" @keyup.enter.native="searchConfirm" clearable>
					<template slot-scope="{ item }">
						<div class="hot_search">
							<span class="hot_keyword">{{ item.title }}</span>
							<span class="hot_icon">
								<img :src="hotIconImg(item)" v-if="hotIconImg(item)" />
							</span>
						</div>
					</template>
				</el-autocomplete>

				<el-button class="search_btn" type="info" plain @click="searchConfirm">
					<i class="iconfont icon-sousuo search_logo"></i>
				</el-button>
			</div>
		</div>

		<!-- 导航栏右边区域 -->
		<div class="nav_right">
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "NavBar",
		props: {
			// 热搜数据
			hotsearch: {
				type: Array,
				default () {
					return [];
				},
			},
		},
		data() {
			return {
				// 用于判断搜索框是否存在
				searchExist: true,
				// 搜索区域的显示与隐藏
				searchVisible: true,
				searchInput: "",
				// 屏幕的宽度
				screenWidth: document.body.clientWidth,
				// 热搜数据
				hotData: this.hotsearch,
				// 输入框的数据
				searchData: "",
				// 默认搜索词
				searchDefaults: "请输入内容",
				id: '', //模板id
				resolution: '' ,//尺寸
				theme_id: '' //模板id
			};
		},
		created() {
			// 开始创建dom时先判断一下 搜索区域是否显示
			if (this.screenWidth <= 1200) {
				this.searchVisible = false;
			}
			if (this.$route.path === "/search") {
				this.searchExist = false;
			}
		},
		mounted() {
			const that = this;
			// 在页面mounted时，挂载window.onresize方法
			// 监听窗口变化
			window.onresize = () => {
				return (() => {
					that.screenWidth = document.body.clientWidth;
				})();
			};

			// 获取数据
			// this.restaurants = this.loadAll();
		},
		watch: {
			screenWidth(val) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					this.screenWidth = val;
					this.timer = true;
					const that = this;
					setTimeout(function() {
						if (that.screenWidth <= 1200) {
							that.searchVisible = false;
						} else {
							that.searchVisible = true;
						}
						that.timer = false;
					}, 400);
				}
			},
			// 监听热搜的数据 实时更新data里的值
			hotsearch(val) {
				// console.log(val);
				this.hotData = val;
			},
		},
		methods: {
			// 返回首页
			returnHome() {
				if (this.$route.path === "/home") {
					return;
				}
				this.$router.push("/home");
			},
			// 输入框获取焦点时调用的方法
			async querySearch(queryString, cb) {
				let url = this.$base_url + 'Feentemplateearch/feensearch';
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						type: '1', //模糊查询
						keyword: queryString,
						uid: uid,
					},
				});
				var list = [{}];
				if (res.code == 200) {
					for (let i of res.data) {
						i.value = i.title
					}
					list = res.data
					cb(list);
				}
			},
			// 判断选中了哪个热搜
			handleSelect(item) {
				this.searchData = item.title;
				this.id = item.id;
				this.resolution = item.resolution;
				this.theme_id = item.theme_id
				this.routerJump();
			},
			// 判断热搜图片
			hotIconImg(item) {
				if (item.icon === "") {
					return false;
				}
				return item.icon;
			},

			// 确认搜索
			async searchConfirm() {
				if (this.searchData == "") {
					this.$message({
						// 可关闭
						showClose: true,
						message: "搜索内容为空，无法搜索!",
						type: "warning",
						// 持续时间
						duration: "900",
					});
					return false;
				}

				let url = this.$base_url + 'Feentemplateearch/feensearch';
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						type: '2', //模糊查询
						keyword: this.searchData,
						uid: uid,
					},
				});
				console.log(res);
				if (res.code == 200) {
					this.id = res.data.id;
					this.resolution = res.data.resolution
					this.theme_id = res.data.theme_id
					this.routerJump();
				} else {
					this.$message.error(res.msg);
				}
			},

			// 路由跳转
			routerJump() {
				// 跳转到搜索页面
				this.$router.push(`/search?keyword=${this.searchData}&id=${ this.id }&resolution=${ this.resolution }&theme_id=${ this.theme_id }`);
			},
		},
	};
</script>

<style scoped>
	* {
		color: #fff;
	}

	.navbar_main {
		display: flex;
		height: 56px;
		/* justify-content: space-between; */
		align-items: center;
	}

	/* nav左边部分 */
	.nav_left {
		width: 434px;
		height: 100%;
	}

	.nav_left ul {
		display: flex;
		padding: 0;
		margin-top: 16px;
		justify-content: space-around;
	}

	.nav_left_item {
		cursor: pointer;
		font-size: 14px;
		color: #fff;
	}

	.home_logo {
		color: #fff;
	}

	.app_logo {
		font-size: 16px;
	}

	/* nav 游戏 */
	.nav-game {
		display: flex;
		justify-content: space-between;
		width: 350px;
	}

	.n-g-left {
		width: 60%;
	}

	.n-g-img {
		width: 100%;
		border-radius: 5px;
		overflow: hidden;
		background: pink;
		padding: 0;
	}

	.n-g-img img {
		/* 块级元素内部默认有行框，行框撑高了块级元素。
      img和其他块级元素并列的时候，由于img默认是display:inline-block，
      产生匿名块框包裹img，匿名块框内部生成了行框，多余了几个像素 */
		display: block;
		width: 100%;
	}

	.n-g-recommend {
		width: 100%;
		display: flex;
	}

	.recommend-item {
		flex: 1;
		margin-top: 10px;
		border-radius: 15px;
		overflow: hidden;
	}

	.recommend-item:nth-child(2) {
		margin: 10px 15px 0;
	}

	.recommend-item img {
		display: block;
		width: 100%;
	}

	/* 下划线 */
	.el-divider {
		height: 180px;
	}

	.n-g-right {
		width: 30%;
	}

	.n-g-title {
		display: block;
		color: #555;
		font-size: 12px;
		line-height: 30px;
	}

	/* nav 直播 */
	.nav-zhibo {
		width: 400px;
		display: flex;
		justify-content: space-between;
	}

	.n-z-left {
		width: 55%;
	}

	.n-z-l-title {
		font-size: 16px;
		color: #ec81a7;
	}

	.n-z-l-main {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.n-z-l-item {
		display: inline-block;
		width: 28%;
		margin-top: 10px;
	}

	.n-z-l-item img {
		width: 100%;
		border-radius: 50%;
	}

	.n-z-l-item p {
		color: #555;
		font-size: 12px;
		/* 一行显示 */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	/* 下划线 */
	.hot-divider {
		height: 208px;
	}

	.n-z-right {
		width: 40%;
	}

	.n-z-right img {
		width: 100%;
		margin-top: 20px;
	}

	/* nav 扫码 */
	.nav-app {
		width: 200px;
	}

	.nav-app img {
		width: 100%;
	}

	/* nav中间部分 */
	.nav_center {
		flex: 1;
		margin: 0 30px;
	}

	.nav_center_search {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 2vw;
	}

	.search_inp {
		flex: 1;
		border-top-right-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
	}

	.hot_pos {
		display: inline-block;
		width: 24px;
		height: 24px;
		text-align: center;
		font-size: 12px;
		color: #555;
	}

	.hot_keyword {
		display: inline-block;
		font-size: 12px;
		color: #555;
		margin: 0 8px;
	}

	.hot_icon {
		display: inline-block;
		width: 14px;
		height: 14px;
	}

	.hot_icon img {
		width: 100%;
		height: 100%;
	}

	.search_btn {
		width: 48px;
		height: 40px;
		margin: 0;
		padding: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.search_logo {
		font-size: 24px;
		font-weight: 600;
		color: #2999d9;
	}

	/* nav右边部分 */
	.nav_right {
		height: 100%;
		width: 454px;
	}

	.nav_right ul {
		display: flex;
		margin: 0;
		margin-top: 8px;
		padding: 0;
		justify-content: space-around;
		align-items: center;
	}

	.nav_right_item {
		cursor: pointer;
		font-size: 14px;
		color: #fff;
	}

	/* 大会员 */
	.bigmember {
		width: 200px;
		font-size: 12px;
	}

	.bigmember-title {
		color: #555;
		font-weight: 600;
	}

	.bigmember-img {
		margin-top: 10px;
	}

	.bigmember-img img {
		width: 100%;
	}

	.bigmember p {
		color: #555;
		margin: 10px 0;
	}

	.bigmember-btn {
		text-align: center;
	}

	/* 消息 */
	.message {
		width: 100px;
	}

	.message-item {
		cursor: pointer;
		display: block;
		margin-bottom: 10px;
		padding-left: 8px;
	}

	.message-item span {
		color: #555;
		font-size: 13px;
	}

	.message-item-spot {
		float: right;
	}
</style>
