<template>
	<div id="home">
		<el-container>
			<!-- 头部导航模块 -->
			<el-header class="min_width">
				<nav-bar :hotsearch="hotData"></nav-bar>
				<div class="banner">
					<!-- <img src="../assets/img/b-banner.jpg" alt="" /> -->
				</div>
			</el-header>
			<!-- 主体区域 -->
			<el-main>
				<!-- tab栏区域 -->
				<!-- <div class="b-wrap tab_main">
					<div class="tab_center">
						<span v-for="(item, i) in tabsList" :key="i" class="tab_center_item">
							<a href="#">
								<span @click="getlist(item.tag_id)">{{ item.tag_name }}</span>
							</a>
						</span>
					</div>
				</div> -->

				<!-- 各种内容 -->
				<div class="b-wrap">
					<!-- 动画 -->
					<div class="various-content">
						<!-- 卡片区域 -->
						<card :maindata="animationList" :count="count" class="various-c-card"></card>
						<!-- 排行榜 -->
						<top-list :maindata="hotData" class="various-c-toplist"></top-list>
					</div>
				</div>
			</el-main>

			<!-- 底部 -->
			<!-- <v-footer class="home-footer"></v-footer> -->
		</el-container>

		<!-- 回到顶部 -->
		<el-backtop>
			<div class="backtop-main">
				<img src="../assets/img/backtop.png" alt="" />
			</div>
		</el-backtop>
	</div>
</template>

<script>
	import axios from "axios";

	// 组件
	import Card from "./common/card/Card";
	import TopList from "./common/toplist/TopList";

	export default {
		name: "Home",
		components: {
			Card,
			TopList,
		},
		data() {
			return {
				tabsLeftList: [],
				tabsList: [],
				tabsRightList: [],
				// 页面数据
				mainDataList: [],
				// 轮播图数据
				swiperList: [],
				// 轮播图右边数据
				swiperList_r: [],
				// 动画模块数据
				animationList: [],
				// 热搜数据
				hotData: [],
				//总数
				count: 0,
			};
		},
		created() {
			// 获取tab栏数据
			this.getTabsList();

			// 获取热搜数据
			this.getHotData();

			//获取分类
			this.getClass();
			
			//获取uid
			localStorage.setItem('user_id',this.$route.query.uid);
			localStorage.setItem('type',this.$route.query.type);
			localStorage.setItem('status',this.$route.query.status);
		},
		watch: {
			animationList(val) {
				this.$forceUpdate();
			},
		},
		methods: {
			// 获取tabs栏的数据
			async getTabsList() {
				let url = this.$base_url + 'Feentemplatelist/feentemplatelist';
				let uid = localStorage.getItem('user_id');
				let type = localStorage.getItem('type');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						type: type,
						page: '1',
						limit: '50',
						uid: uid,
					},
				});
				if (res.code == 200) {
					this.animationList = res.data.list
					this.count = res.data.count
				} else {
					this.$message.error(res.msg);
				}
			},


			async getlist(id) {
				let url = this.$base_url + 'Feentemplateelist/feenclasslist';
				let type = localStorage.getItem('type');
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						uid: uid,
						classid: id,
						type: type
					},
				});
				// console.log();
				// if (res.code == 200) {
				// 	this.hotData = res.data
				// } else {
				// 	this.$message.error(res.msg);
				// }
			},

			// 获取热搜数据
			async getHotData() {
				let url = this.$base_url + 'FeenGetHotDatat/feenGetHotData';
				let type = localStorage.getItem('type');
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						uid: uid,
					},
				});
				if (res.code == 200) {
					this.hotData = res.data
				} else {
					this.$message.error(res.msg);
				}
			},

			//获取分类
			async getClass() {
				let url = this.$base_url + 'Feentemplateclass/feengetClass';
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						uid: uid,
					},
				});
				if (res.code == 200) {
					this.tabsList = res.data
				} else {
					this.$message.error(res.msg);
				}
			},
			// 点击跳转路径
			jumpPath(keyword) {
				this.$router.push(`/search?keyword=${keyword}`);
			},
		},
	};
</script>

<style>
	.el-container {
		min-width: 1300px !important;
	}

	.el-header {
		/* padding: 0 !important; */
		position: relative;
		/* 背景渐变 */
		background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(97, 112, 94, 0.1));
	}

	.banner {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
		height: 9.5vw;
		min-height: 155px;
		overflow: hidden;
	}

	.banner img {
		/* width: 100%; */
		height: 100%;
	}

	/* 主体区域 */
	.el-main {
		margin-top: 7%;
		height: 100%;
		padding: 0 !important;
	}

	.b-wrap {
		width: 84vw;
		margin: 0 8vw;
		/* 最小宽度 */
		min-width: 1170px;
	}

	.tab_main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 108px;
		padding: 20px 0;
	}

	/* tab栏左边区域 */
	.tab_left {
		width: 200px;
	}

	.tab_left_item {
		width: 50px;
		height: 68px;
		text-align: center;
		font-size: 14px;
	}

	.tab_left_item2 {
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.round {
		display: inline-block;
		width: 36px;
		height: 36px;
		line-height: 36px;
	}

	.round i {
		color: #fff;
		border-radius: 50%;
		padding: 5px;
		font-size: 20px;
	}

	/* tab栏中间区域 */
	.tab_center {
		flex: 1;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		text-align: center;
		/* border-left: 1px solid rgba(105, 105, 105, 0.2);
  border-right: 1px solid rgba(105, 105, 105, 0.2); */
	}

	.tab_center_item {
		/* position: relative; */
		display: inline-block;
		width: 10%;
		font-size: 14px;
		margin-top: 5px;
	}

	.tab_center_item span {
		margin-right: 2px;
	}

	.tab_center_item span img {
		/* position: absolute; 
  top: 5px;
  left: 29px;*/
		width: 28px;
	}

	/* tab栏右边区域 */
	.tab_right {
		margin-left: 8px;
		width: 216px;
	}

	.tab_right ul {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding-left: 0;
	}

	.tab_right_item {
		font-size: 14px;
		margin-right: 6px;
		margin-top: 5px;
	}

	.tab_right_item i {
		font-size: 18px;
		margin-right: 5px;
	}

	/* 第一内容 */
	.first-content {
		/* 242px */
		height: 17vw;
		min-height: 220px;
	}

	/* 轮播图 */
	.space-between {
		display: flex;
		justify-content: space-between;
		height: 100%;
	}

	.el-carousel {
		width: 550px;
		height: 100% !important;
		border-radius: 8px;
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
	}

	.el-carousel__container {
		height: 100% !important;
	}

	.el-carousel__item {
		/* position: relative; */
		width: 550px;
		height: 100% !important;
	}

	.swiper_img {
		display: inline-block;
		width: 100%;
	}

	.swiper_title {
		display: inline-block;
		width: 50%;
		position: absolute;
		left: 15px;
		bottom: 20px;
		color: #fff;
		font-size: 15px;
		font-weight: 400;
		/* 一行显示 */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	/* 轮播图右边内容 */
	.swiper_right_content {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		margin-left: 1vw;
	}

	.s_r_c_item {
		position: relative;
		width: 32%;
		height: 48%;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
	}

	.s_r_c_item img {
		width: 100%;
		display: block;
	}

	.s_r_c_title {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		line-height: 23px;
		color: #fff;
		font-size: 14px;
		background-image: linear-gradient(to top,
				rgba(0, 0, 0, 0.6),
				rgba(119, 119, 119, 0.1));
		padding: 2px 5px 5px;
		/* 一行显示 */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.title_two_show {
		-webkit-line-clamp: 2;
	}

	/* 各种内容区域 */
	.various-content {
		display: flex;
		justify-content: space-around;
		margin-top: 30px;
	}

	.various-c-card {
		width: 75%;
	}

	.various-c-toplist {
		flex: 1;
	}

	/* 底部 */
	.home-footer {
		margin-top: 50px;
	}

	/* 回到顶部 */
	.backtop-main img {
		width: 120%;
	}
</style>
