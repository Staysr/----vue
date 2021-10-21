<template>
	<div class="card-list">
		<!-- 楼层标题 -->
		<header class="storey-title">
			<div class="s-t-left">
				<i class="iconfont icon-donghua"></i>
				<div>{{ getName() }}</div>
			</div>
			<div class="s-t-right">
			</div>
		</header>
		<!-- 楼层内容 -->
		<div class="storey-content">
			<div class="s-c-item" v-for="(item, i) in maindataItemlist" :key="i"
				@click="jumpPath(item.title,item.id,item.resolution,item.theme_id)">
				<!-- 图片 -->
				<div class="item-pic">
					<!-- 3.图片懒加载修改img :src -> v-lazy -->
					<img v-lazy="item.cover_url" alt="" />
					<!-- <video :src='item.video_url'></video> -->
					<div class="count">
						<i class="iconfont icon-bofangliang1"></i>
						{{ item.title}}
						<i class="iconfont icon-dianzan"></i>
						{{ tenThousand(item.collect_count) }}
					</div>
					<div class="duration">
						{{ timeHandle(item.duration) }} S
					</div>
				</div>
				<!-- 标题 -->
				<div class="item-title">
					<a href="#">{{ item.title }}</a>
				</div>
			</div>
		</div>
		<!-- 分页 -->
		<div style="margin-bottom: 20px;" v-if="ispages">
			<el-pagination @current-change="handleCurrentChange" :current-page="1" :page-sizes="[50, 80, 100, 200]"
				:page-size="50" layout="total, prev, pager, next, jumper" :total="count">
			</el-pagination>
		</div>

	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "CardList",
		props: {
			maindataItem: {
				type: Array,
				default () {
					return [];
				},
			},
		},
		data() {
			return {
				total: 10,
				page: 1,
				limit: 50,
				maindataItemlist: '',
				count: 0,
				ispages: false,
			};
		},
		created() {
			this.getName();
			this.datalist();
		},
		computed: {
			// 计算数量过万就转换
			tenThousand() {
				// 计算属性是一个属性不是一个方法, 使用函数返回
				return function(count) {
					if (count >= 100000000) {
						return (count / 100000000).toFixed(1) + "亿";
					}
					return count >= 10000 ? (count / 10000).toFixed(1) + "万" : count;
				};
			},
		},
		methods: {
			// 获取标题名字
			getName() {
				return '模板列表';
			},
			// 处理时间
			timeHandle(time) {
				let timeFormat = "";

				function allTime(time) {
					if (time < 60) {
						let s = time > 0 ? time : "";
						s = s <= 10 ? "0" + s : s;
						timeFormat = timeFormat + s;
						return;
					} else if (time < 3600) {
						let m = Math.floor(time / 60);
						m = m <= 10 ? "0" + m : m;
						timeFormat = timeFormat + m + ":";
						allTime(time - m * 60);
					} else {
						let h = Math.floor(time / 3600);
						h = h <= 10 ? "0" + h : h;
						timeFormat = timeFormat + h + ":";
						allTime(time - h * 3600);
					}
				}
				allTime(time);
				return timeFormat;
			},

			// 点击跳转
			jumpPath(keyword, id, resolution,theme_id) {
				this.$router.push(`/search?keyword=${keyword}&id=${ id }&resolution=${ resolution }&theme_id=${ theme_id }`);
			},
			async handleCurrentChange(val) {
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
						page: val,
						limit: '50',
						uid: uid,
					},
				});
				if (res.code == 200) {
					this.maindataItemlist = res.data.list
					this.count = res.data.count
					this.backTop()
				} else {
					this.$message.error(res.msg);
				}
			},
			async datalist() {
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
					this.maindataItemlist = res.data.list
					this.count = res.data.count
					this.ispages = true
				} else {
					this.$message.error(res.msg);
				}
			},
			backTop() {
				document.body.scrollTop = 0
				document.documentElement.scrollTop = 0
			}
		},
	};
</script>

<style scoped>
	.card-list {
		width: 100%;
		font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,
			Heiti SC, WenQuanYi Micro Hei, sans-serif;
	}

	/* 楼层标题区域 */
	.storey-title {
		padding: 10px;
		display: flex;
		justify-content: space-between;
	}

	.s-t-left {
		display: flex;
		align-items: center;
		font-size: 20px;
		cursor: pointer;
	}

	.s-t-left i {
		font-size: 28px;
		color: #7b78eb;
		margin-right: 8px;
	}

	.s-t-right {
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		width: 15%;
		font-size: 12px;
	}

	.s-t-right .btn-change {
		flex: 1;
		margin-right: 5px;
		padding: 2px 5px;
		border-radius: 5px;
		border: 1px solid #ccc;
		cursor: pointer;
	}

	.btn-change:hover {
		background: #f5f5f5;
	}

	.s-t-right .more {
		padding: 2px 5px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}

	/* 楼层内容区域 */
	.storey-content {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.s-c-item {
		width: 19%;
		margin-bottom: 10px;
	}

	.item-pic {
		position: relative;
		width: 100%;
		max-height: 116px;
		border-radius: 5px;
		overflow: hidden;
		/* box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); */
	}

	.item-pic img {
		display: block;
		width: 100%;
	}

	.item-pic .count {
		position: absolute;
		left: 0;
		bottom: 0;
		font-size: 12px;
		padding: 3px 5px;
		color: #fff;
		background-image: linear-gradient(to top,
				rgba(0, 0, 0, 0.6),
				rgba(119, 119, 119, 0.1));
		width: 100%;
		/* 一行显示 */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.duration {
		position: absolute;
		right: 0;
		top: 0;
		padding: 3px 5px;
		color: #fff;
		background-image: linear-gradient(to left bottom,
				rgba(0, 0, 0, 0.6),
				rgba(255, 255, 255, 0.1));
		border-bottom-left-radius: 8px;
	}

	.item-title {
		height: 21%;
		margin-top: 5px;
		margin-bottom: 10px;
		font-size: 14px;
		/* 两行显示 */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		color: #4d4d4d;
	}

	.item-up {
		padding-left: 5px;
	}

	.item-up a {
		font-size: 12px;
		color: #999;
	}
</style>
