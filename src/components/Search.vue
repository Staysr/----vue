<template>
	<div class="search">
		<!-- 顶部搜索区域 -->
		<header class="search_header">
			<nav-bar></nav-bar>
		</header>

		<!-- 主体区域 -->
		<div class="search_main">
			<!-- 顶部搜索加tabs栏 -->
			<div class="head-contain">
				<div class="search-wrap">
					<div class="s-logo">
						<!-- <img src="../assets/img/search-logo.png" alt="" /> -->
					</div>
					<div class="s-inp">
						<el-input class="search_inp" placeholder="请输入内容" v-model="searchInput"
							@keyup.enter.native="searchConfirm" clearable>
						</el-input>
					</div>
					<!-- <div class="s-btn">
						<el-button class="search_btn" type="search" @click="searchConfirm">
							<i class="iconfont icon-sousuo search_logo"></i>
							<span class="search_title">搜索</span>
						</el-button>
					</div> -->
				</div>
			</div>
			<div style="width: 1200px;margin: 0px auto;">
				<div class="body-contain" style="margin-top: 20px;width: 71%;float: left;">
					<!-- 视频内容 -->
					<el-card class="box-card">
						<div class="text item">
							<video :style="resolution == '16x9'? 'width: 100%;' : 'width: 32%;' " style="height: 100%;"
								:src="mainDataList.video_url" autoplay controls></video>
						</div>
					</el-card>
				</div>
				<div style="width: 27%; float: left;margin-left: 20px;margin-top: 20px;">
					<el-card class="box-card">
						<div class="text item">
							<el-tag>视频标题:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.title }}</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>视频类型:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.theme_type == 'free' ? '一键成片' : '视频' }}</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>视频比例:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.resolution }}</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>视频时长:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.duration }}S</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>视频描述:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.description == '' ? '暂时描述' : mainDataList.description }}
							</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>是否支持高清:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.is_support_hd == 1 ? '支持' : '不支持' }}</el-tag>
						</div>
						<div class="text item" style="margin-top: 15px;">
							<el-tag>是否纯动态文字模板:</el-tag><span style="margin-left: 12px;"></span>
							<el-tag type="info">{{ mainDataList.text_dynamic == 1 ? '是' : '否' }}</el-tag>
						</div>
						<div class="text item" style="margin-top: 55px;">
							<el-button type="primary" round @click="offin()">取消返回</el-button>
							<el-button type="success" round><a class="a-wher" style="color: white;"
									@click="linkDownload(`http://houtai.yaojiushenjiu.com/tmpl/#/jp?theme_id=${ theme_id }&status=${ status }&uid=${uid}`)">去制作</a>
							</el-button>
						</div>
					</el-card>
				</div>
			</div>
		</div>
		<!-- 回到顶部 -->
		<el-backtop>
			<div class="backtop-main">
				<img src="../assets/img/backtop.png" alt="" />
			</div>
		</el-backtop>
	</div>
</template>

<script>
	import VideoItem from "./common/videoitem/VideoItem";
	// 导入分区的静态数据
	import partitionData from "./partitionList";
	const Base64 = require('js-base64').Base64;
	export default {
		name: "search",
		components: {
			VideoItem,
		},
		data() {
			return {
				// 搜索输入框的数据  url 上的keyword
				searchInput: this.$route.query.keyword,
				id: this.$route.query.id,
				resolution: this.$route.query.resolution,
				theme_id: this.Decrypt(this.$route.query.theme_id), //模板id
				uid: this.Decrypt(localStorage.getItem('user_id')),
				status: this.Decrypt('3'),
				// 主要内容数据
				mainDataList: [],
				mainDataListCopy: [],
				// 判断是否有数据 显示没有数据图片
				mainDataYes: true,
				// 鼠标移进的当前item
				currentIndex: null,
				// 判断当前选择的时间
				currentTime: 0,
				// 当前页码
				currentPage: 1,
				playerOptions: {
					//播放速度
					playbackRates: [0.5, 1.0, 1.5, 2.0],
					//如果true,浏览器准备好时开始回放。
					autoplay: true,
					// 默认情况下将会消除任何音频。
					muted: false,
					// 导致视频一结束就重新开始。
					loop: false,
					// 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					preload: 'auto',
					language: 'zh-CN',
					// 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					aspectRatio: '16:9',
					// 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					fluid: true,
					sources: [{
						//类型
						type: "video/mp4",
						//url地址
						src: 'https://permanent.aoscdn.com/app/lightmv/themes/1752/1752LR.mp4'
					}],
					//你的封面地址
					poster: 'https://permanent.aoscdn.com/app/lightmv/themes/1752/1752.jpg?x-oss-process=style/540p',
					//允许覆盖Video.js无法播放媒体源时显示的默认信息。
					notSupportedMessage: '此视频暂无法播放，请稍后再试',
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						//全屏按钮
						fullscreenToggle: true
					}
				}
			};
		},
		created() {
			this.getData();
		},
		mounted() {},
		watch: {
			// 监听激活的时长
			durationActive() {
				this.promptMessage();
			},
			partitionActive() {
				this.promptMessage();
			},
		},
		methods: {
			tabsClick() {
				console.log("点击了tabs栏");
			},
			//取消返回按钮
			offin() {
				this.$router.go(-1);
			},
			//跳转创建任务
			sand() {

			},
			Decrypt(word) {
				const CryptoJS = require("crypto-js");
				let key = '654mca0l38b489d9f306a5b8e105334b',
					iv = 'c5defg0045222c52'
				let encrypt = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(key), {
					iv: CryptoJS.enc.Utf8.parse(iv),
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				})
				return Base64.encode(encrypt.toString());
			},
			ddsss() {
				window.opener = null;
				window.open('', '_self', '');
				window.close();
			},
			// 获取内容数据
			async getData() {
				let url = this.$base_url + 'Feentemplateinfo/feengetinfo';
				let uid = localStorage.getItem('user_id');
				const {
					data: res
				} = await this.$axiosbili({
					method: 'get',
					url: url,
					params: {
						uid: uid,
						id: this.id
					},
				});
				// 如果请求失败 对象中就没有 result 这个属性
				if (res.code === 105 || res.data === undefined) {
					this.mainDataYes = false;
					return;
				}
				this.mainDataYes = true;
				this.mainDataList = res.data;
			},
			linkDownload(url) {
				window.open(url, '_blank') // 新窗口打开外链接
			},
			// 确定搜索
			searchConfirm() {
				this.getData();
				// 修改地址栏
				let query = this.$router.history.current.query;
				let path = this.$router.history.current.path;
				// 对象深拷贝
				let newQuery = this.$lodash.cloneDeep(query);
				// 地址栏的参数重新赋值
				newQuery.keyword = this.searchInput;
				this.$router.push({
					path,
					query: newQuery
				});
			},
			// 提示信息
			promptMessage() {
				this.$message({
					// 可关闭
					showClose: true,
					message: "由于数据问题，仅对当前页有效噢!",
					type: "warning",
					// 持续时间
					duration: "1500",
				});
			},
			// 鼠标事件
			enter(i) {
				this.currentIndex = i;
			},
			leave() {
				this.currentIndex = null;
			},
		},
	};
</script>

<style scoped>
	.search {
		min-width: 1090px;
	}

	.search_header {
		background-image: linear-gradient(rgba(12, 73, 153, 0.7),
				rgba(163, 186, 250, 0.4));
	}

	.search_main {
		margin: 0 auto;
		/* width: 980px; */
	}

	.head-contain {
		padding-top: 40px;
	}

	.search-wrap {
		display: flex;
		width: 60%;
		margin: 0 auto;
	}

	.s-logo {
		width: 140px;
		height: 40px;
	}

	.s-logo img {
		width: 100%;
	}

	.s-inp {
		flex: 1;
		margin: 0 10px;
	}

	.s-btn {
		width: 90px;
		height: 40px;
	}

	.search_btn {
		position: relative;
		width: 100%;
		height: 100%;
		line-height: 100%;
		font-size: 16px;
		padding: 0;
	}

	.search_logo {
		position: absolute;
		left: 5px;
		top: 11px;
		font-size: 36px;
	}

	.search_title {
		margin-left: 20px;
	}

	/* tab栏 */
	.el-tabs {
		margin-top: 20px;
	}

	/* 折叠区域 */
	.el-collapse {
		border: 0;
	}

	.allpartition {
		margin-top: 10px;
	}

	/* 分区 */
	.partition-item {
		margin-right: 4px;
	}

	.main-data-item {
		margin-top: 20px;
		margin-right: 25px;
	}

	.main-data-item:nth-child(5n) {
		margin-right: 0;
	}

	.video-list-no {
		margin: 50px;
		text-align: center;
	}

	/* 鼠标移进来添加的类名 */
	.item-hover {
		background: rgba(223, 223, 223, 0.3);
	}

	/* 回到顶部 */
	.backtop-main img {
		width: 120%;
	}
</style>
