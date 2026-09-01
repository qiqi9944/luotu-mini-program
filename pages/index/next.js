// pages/index/next.js
const app = getApp()
const userData = wx.getStorageSync('userData')
import * as echarts from '../../ec-canvas/echarts';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 0,
		xqData: [
			{ "t1": "销量", "t2": "0", "t3": "+0%" },
			{ "t1": "销额", "t2": "0", "t3": "-0%" },
			{ "t1": "平均价格", "t2": "0", "t3": "+0%" },
		],
		val0: 0,
		realval0: 1,
		arrval0: [
			// {
			// 	id: 1,
			// 	name: '投影智能'
			// },
			// {
			// 	id: 2,
			// 	name: '线上电商平台2'
			// },
			// {
			// 	id: 3,
			// 	name: '线上电商平台3'
			// },
		],
		val1: 0,
		realval1: 0,
		arrval1: [],
		val2: 0,
		realval2: 1,
		arrval2: [],
		val3: 0,
		realval3: 1,
		arrval3: [],
		ec: {
			lazyLoad: true
		},
		ec2: {
			lazyLoad: true
		},
		ec3: {
			lazyLoad: true
		},
		ec4: {
			lazyLoad: true
		},
		chart1: [],
		chart1x: [],
		kuanian: null,
		chart2: [],
		chart2x: [],
		chart3: [],
		chart4: [],
		priceList: [],
		brandList: [],
		tips: '',
		arr_sj2_dw: '',//市场规模单位
		changeIndex: 0,
		changeOptions: [
			{ id: 'yoy', name: '同比' },
			{ id: 'mom', name: '环比' }
		],
		periodIndex: 0,
		periodOptions: [
			{ id: 'month', name: '月度' },
			{ id: 'quarter', name: '季度' }
		],
		ytdIndex: 1,
		ytdOptions: [
			{ id: 0, name: '当期' },
			{ id: 1, name: '年累计' }
		],
		yuebao: [],
		jibao: [],
		nianbao: [],
		rdlist: [],
		activeTab: 'scale'
	},
	setOption: function (chart) {
		let that = this
		var data = this.data.chart1x
		const option = {
			tooltip: {
				trigger: 'axis',
				triggerOn: 'click',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function (val) {
					var txt = val[0].name;
					return val[0].marker + val[0].name + " : " + val[0].value + that.data.arr_sj2_dw;
				}
			},
			legend: {
				show: false
			},
			grid: {
				left: 25,
				right: 10,
				bottom: 15,
				top: 30,
				containLabel: true,
			},
			xAxis: [
				{
					type: 'category',
					axisTick: { show: false },
					data: data,
					axisLine: {
						show: false,
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666',
						interval: 0,
						// rotate: 45
						formatter: function (val, index) {
							if (data.length > 4) {
								if (index == 0 || index == data.length - 1 || index == Math.round(data.length / 2) - 1) {
									return val
								} else {
									return ''
								}
							} else {
								return val
							}
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					splitLine: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666'
					}
				}
			],
			series: {
				// name: '热度',
				type: 'bar',
				label: {
					normal: {
						show: false,
						position: 'top'
					}
				},
				barMaxWidth: 15,
				data: this.data.chart1,
				itemStyle: {
					borderRadius: 20,
					color: (params) => {
						// console.log(params)
						// if(this.data.kuanian!==null && params.dataIndex>this.data.kuanian){
						if (0) {
							return {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0, color: '#f16568' // 0% 处的颜色
								}, {
									offset: 1, color: '#cd3c29' // 100% 处的颜色
								}],
							}
						} else {
							return {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0, color: '#3d9bbd' // 0% 处的颜色
								}, {
									offset: 1, color: '#005d99' // 100% 处的颜色
								}],
							}
						}

					}
				}
			}
		};
		chart.setOption(option);
	},
	setOption2: function (chart) {
		let that = this
		const option = {
			tooltip: {
				trigger: 'axis',
				triggerOn: 'click',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function (val) {
					var txt = val[0].name;
					return val[0].marker + val[0].name + " : " + val[0].value + "%";
				}
			},
			legend: {
				show: false
			},
			grid: {
				left: 10,
				right: 25,
				bottom: 15,
				top: 30,
				containLabel: true,
			},
			xAxis: [
				{
					type: 'value',
					splitLine: {
						show: false
					},
					axisTick: { show: false },
					axisLine: {
						show: false,
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666',
						formatter: '{value} %'
					}
				}
			],
			yAxis: [
				{
					type: 'category',
					data: this.data.chart2x,
					splitLine: {
						show: false
					},
					axisTick: { show: false },
					axisLine: {
						show: false,
						lineStyle: {
							color: '#999'
						}
					},
					axisLabel: {
						color: '#666'
					}
				}
			],
			series: {
				name: '热度',
				type: 'bar',
				barMaxWidth: 15,
				label: {
					normal: {
						show: false,
						position: 'right',
						formatter: '{c}%'
					}
				},
				data: this.data.chart2,
				itemStyle: {
					borderRadius: 20,
					color: {
						type: 'linear',
						// x: 0,
						// y: 0,
						// x2: 0,
						// y2: 1,
						colorStops: [{
							offset: 0, color: '#f16568' // 0% 处的颜色
						}, {
							offset: 1, color: '#cd3c29' // 100% 处的颜色
						}],
					},
				}
			}
		};
		chart.setOption(option);
	},
	setOption3: function (chart) {
		let that = this
		const option = {
			tooltip: {
        // show: that.data.is_ck == 1 ? true : false,
				trigger: 'item',
				formatter: function (params) {
					console.log(params)
					return params.marker + ' ' + params.data.name + '  ' + (that.data.is_ck == 1 ? (parseFloat(params.percent).toFixed(1) + "%") : '');
				}
			},
			title: {
				text: this.data.arr_sj6.t1,
				left: "center",
				top: "center",
				textStyle: {
					fontSize: 16
				},
			},
			color: ['#005d99', '#cd3c29', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
			series: [
				{
					name: '',
					type: 'pie',
					radius: ['45%', '60%'],
					avoidLabelOverlap: false,
					labelLine: {
						show: true,
						smooth: true,
						length: 2
					},
					label: {
            // show: that.data.is_ck == 1 ? true : false,
						// formatter: '{b} {d}%',
						color: '#333',
						formatter: function (a, b, c) {
							// console.log(a)
							// console.log(b)
							// console.log(c)
							// if (a.data.value == 1) {
							// 	return 100 + "%";
							// } else {
							// 	return a.data.name + ' ' + parseFloat(a.percent).toFixed(1) + "%";
              // }
              return a.data.name + ' ' + (that.data.is_ck == 1 ? (parseFloat(a.percent).toFixed(1) + "%") : '');
						},
					},
					itemStyle: {
						borderColor: '#fff',
						borderWidth: 1,
					},
					data: this.data.chart3
				}
			]
		};
		chart.setOption(option);
	},
	setOption4: function (chart) {
		let that = this
		const option = {
			tooltip: {
        // show: that.data.is_ck == 1 ? true : false,
				trigger: 'item',
				formatter: function (params) {
					console.log(params)
					return params.marker + ' ' + params.data.name + '  ' + (that.data.is_ck == 1 ? (parseFloat(params.percent).toFixed(1) + "%") : '');
				}
			},
			title: {
				text: this.data.arr_sj6.t2,
				left: "center",
				top: "center",
				textStyle: {
					fontSize: 16
				},
			},
			color: ['#005d99', '#cd3c29', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
			series: [
				{
					name: '',
					type: 'pie',
					radius: ['45%', '60%'],
					avoidLabelOverlap: false,
					labelLine: {
						show: true,
						smooth: true,
						length: 2
					},
					label: {
            // show: that.data.is_ck == 1 ? true : false,
						// formatter: '{b} {d}%',
						color: '#333',
						formatter: function (a, b, c) {
							// console.log(a)
							// console.log(b)
							// console.log(c)
							// if (a.data.value == 1) {
							// 	return 100 + "%";
							// } else {
							// 	return a.data.name + ' ' + parseFloat(a.percent).toFixed(1) + "%";
              // }
              return a.data.name + ' ' + (that.data.is_ck == 1 ?(parseFloat(a.percent).toFixed(1) + "%") : '');
						},
					},
					itemStyle: {
						borderColor: '#fff',
						borderWidth: 1
					},
					data: this.data.chart4
				}
			]
		};
		chart.setOption(option);
	},
	formatPercent: function (value) {
		const num = Number(value)
		if (!isFinite(num)) return '--'
		return `${num.toFixed(1)}%`
	},
	buildPriceList: function (list) {
		const priceRanges = ['0-99', '100-199', '200-299', '300-399', '400-499', '500+']
		if (!Array.isArray(list) || !list.length) return []
		const priceMap = {}
		let matchedPriceRange = false
		list.forEach((item) => {
			const name = item && item.name ? String(item.name).replace(/元/g, '').trim() : ''
			if (!priceMap[name]) priceMap[name] = { value: 0, t3: '' }
			const value = Number(item && item.value)
			priceMap[name].value += isFinite(value) ? value : 0
			if (item && item.t3) priceMap[name].t3 = item.t3
			if (priceRanges.indexOf(name) > -1) matchedPriceRange = true
		})
		const total = list.reduce((sum, item) => {
			const val = Number(item && item.value)
			return sum + (isFinite(val) ? val : 0)
		}, 0)
		if (!matchedPriceRange) {
			return list.map((item) => {
				const name = item && item.name ? String(item.name).replace(/元/g, '').trim() : '--'
				const value = Number(item && item.value)
				const share = total > 0 && isFinite(value) ? value / total * 100 : 0
				const change = item && item.t3 ? item.t3 : '--'
				const changeFlag = change === '--' ? '' : change.substr(0, 1)
				return {
					name,
					t1: name,
					t2: this.formatPercent(share),
					t3: change,
					t3zf: changeFlag,
				}
			})
		}
		return priceRanges.map((name) => {
			const item = priceMap[name] || { value: 0, t3: '' }
			const share = total > 0 ? item.value / total * 100 : 0
			const change = item.t3 ? item.t3 : '--'
			const changeFlag = change === '--' ? '' : change.substr(0, 1)
			return {
				name,
				t1: name,
				t2: this.formatPercent(share),
				t3: change,
				t3zf: changeFlag,
			}
		})
	},
	// 品牌竞争表格：优先用后端 arr_sj8，缺失时回退到 arr_sj3(品牌+市占率)
	buildBrandList: function (list, fallbackX, fallbackY) {
		if (Array.isArray(list) && list.length) {
			return list.map((item) => {
				const share = item.share !== undefined && item.share !== '' ? String(item.share) + '%' : '--'
				const shareC = item.share_c !== undefined && item.share_c !== '' ? String(item.share_c) : '--'
				const price = item.price !== undefined && item.price !== '' ? String(item.price) : '--'
				const priceC = item.price_c !== undefined && item.price_c !== '' ? String(item.price_c) : '--'
				return {
					name: item.name || '--',
					share,
					share_c: shareC === '--' ? '--' : shareC + '%',
					share_czf: shareC === '--' ? '' : shareC.substr(0, 1),
					price,
					price_c: priceC === '--' ? '--' : priceC + '%',
					price_czf: priceC === '--' ? '' : priceC.substr(0, 1),
				}
			})
		}
		const x = fallbackX || []
		const y = fallbackY || []
		if (x.length) {
			return x.map((name, i) => ({
				name,
				share: y[i] !== undefined ? String(y[i]) + '%' : '--',
				share_c: '--',
				share_czf: '',
				price: '--',
				price_c: '--',
				price_czf: '',
			}))
		}
		return []
	},
	// 点击按钮后初始化图表
	init: function () {
		let that = this
		this.ecComponent = this.selectComponent('#mychart-dom-bar');
		this.ecComponent2 = this.selectComponent('#mychart-dom-bar2');
		this.ecComponent3 = this.selectComponent('#mychart-dom-bar3');
		this.ecComponent4 = this.selectComponent('#mychart-dom-bar4');
		if (this.chart1) {
			this.chart1.dispose();
		}
		if (this.chart2) {
			this.chart2.dispose();
		}
		if (this.chart3) {
			this.chart3.dispose();
		}
		if (this.chart4) {
			this.chart4.dispose();
		}
		if (this.ecComponent) this.ecComponent.init((canvas, width, height, dpr) => {
			// 获取组件的 canvas、width、height 后的回调函数
			// 在这里初始化图表
			const chart = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			that.setOption(chart);

			// 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
			this.chart = chart;
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return chart;
		});
		if (this.ecComponent2 && this.data.chart2x.length) this.ecComponent2.init((canvas, width, height, dpr) => {
			// 获取组件的 canvas、width、height 后的回调函数
			// 在这里初始化图表
			const chart2 = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			that.setOption2(chart2);

			// 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
			this.chart2 = chart2;
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return chart2;
		});
		if (this.ecComponent3 && this.data.chart3.length) this.ecComponent3.init((canvas, width, height, dpr) => {
			// 获取组件的 canvas、width、height 后的回调函数
			// 在这里初始化图表
			const chart3 = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			that.setOption3(chart3);

			// 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
			this.chart3 = chart3;
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return chart3;
		});
		if (this.ecComponent4 && this.data.chart4.length) this.ecComponent4.init((canvas, width, height, dpr) => {
			// 获取组件的 canvas、width、height 后的回调函数
			// 在这里初始化图表
			const chart4 = echarts.init(canvas, null, {
				width: width,
				height: height,
				devicePixelRatio: dpr // new
			});
			that.setOption4(chart4);

			// 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
			this.chart4 = chart4;
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return chart4;
		});
	},
	bindPickerChange: function (e) {
		console.log(e)
		let that = this
		let val = e.detail.value
		let name = e.target.dataset.name
		let real = e.target.dataset.real
		let realval = that.data['arr' + name][val].id
		that.setData({
			[name]: val,
			[real]: realval
		})
		if (name == 'val0') {
			that.resetdspt()
    }
    if (name == 'val1') {
			that.resetdspt2()
		}
		setTimeout(() => {
			that.getshuju()
		})
	},
	bindLocalPickerChange: function (e) {
		const name = e.currentTarget.dataset.name
		const value = Number(e.detail.value)
		this.setData({
			[name]: value
		}, () => {
			this.getshuju()
		})
	},
	jiequ: function (str) {
		// console.log(str)
		return str.substr(0, 1)
	},
	chuli: function () {
		var xq = this.data.xqData
		for (const key in xq) {
			const item = xq[key];
			item['t3zf'] = this.jiequ(item['t3'])
		}
		this.setData({
			xqData: xq,
		})
	},
	// 重置电商平台选项
	resetdspt: function () {
		let that = this
		that.setData({
			val1: 0,
			realval1: '',
			val2: 0,
			realval2: '',
			val3: 0,
			realval3: '',
		})
  },
  resetdspt2: function () {
		let that = this
		that.setData({
			val2: 0,
			realval2: '',
			val3: 0,
			realval3: '',
		})
	},
	// 自动调整realval
	autorealval: function (e) {
		let that = this
		let realval0 = that.data.realval0
		let arrval0 = that.data.arrval0
		if (realval0 !== null) {
			for (const key in arrval0) {
				const item = arrval0[key];
				if (item.id == realval0) {
					that.setData({
						val0: key
					})
				}
			}
		}
		let realval1 = that.data.realval1
		let arrval1 = that.data.arrval1
		if (realval1 !== null) {
			for (const key in arrval1) {
				const item = arrval1[key];
				if (item.id == realval1) {
					that.setData({
						val1: key
					})
				}
			}
		}
		// let val0 = that.data.val0
		// if (val0 !== null) {
		// 	let realval0 = that.data['arrval0'][val0].id
		// 	that.setData({
		// 		realval0
		// 	})
		// }
		// let val1 = that.data.val1
		// if (val1 !== null) {
		// 	let realval1 = that.data['arrval1'][val1].id
		// 	that.setData({
		// 		realval1
		// 	})
		// }
		// let val2 = that.data.val2
		// if (val2 !== null) {
		// 	let realval2 = that.data['arrval2'][val2].id
		// 	that.setData({
		// 		realval2
		// 	})
		// }
		// let val3 = that.data.val3
		// if (val3 !== null) {
		// 	let realval3 = that.data['arrval3'][val3].id
		// 	that.setData({
		// 		realval3
		// 	})
		// }
	},
	// 获取下拉内容和统计内容
	getshuju: function () {
		let that = this
		let type = that.data.realval0
		let sel_ds = that.data.realval1
		let sel_xl = that.data.realval2
		let sel_yd = that.data.realval3
		let sel_change = that.data.changeOptions[that.data.changeIndex].id
		let sel_period = that.data.periodOptions[that.data.periodIndex].id
		let sel_ytd = that.data.ytdOptions[that.data.ytdIndex].id
		const bg = () => {
			return new Promise((resolve, reject) => {
				wx.request({
					url: app.globalData.siteUrl + '/Wxapi/getybnews',
					data: { sjtype: type },
					success(res1) {
						resolve(res1.data)
					},
					fail(err1) {
						reject(err1)
					}
				})
			})
		}
		bg().then((resolve) => {
			console.log(resolve)
			that.setData({
				yuebao: resolve.datalist.yuebao,
				jibao: resolve.datalist.jibao,
				nianbao: resolve.datalist.nianbao
			})

		})
		const rd = () => {
			return new Promise((resolve, reject) => {
				wx.request({
					url: app.globalData.siteUrl + '/Wxapi/getnews',
					data: { type: 2, sjtype: type, p: 1 },
					success(res1) {
						resolve(res1.data)
					},
					fail(err1) {
						reject(err1)
					}
				})
			})
		}
		rd().then((resolve) => {
			console.log(resolve)
			that.setData({
				rdlist: resolve.datalist
			})
    })
    const userData = wx.getStorageSync('userData')
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getshuju',
			data: {
				type: type,
				sel_ds: sel_ds,
				sel_xl: sel_xl,
				sel_yd: sel_yd,
				sel_change: sel_change,
				sel_period: sel_period,
				sel_ytd: sel_ytd,
        uid:userData.id?userData.id:0
			},
			success(res) {
				
				setTimeout(function () {
					if (!res.data.arr_sj1) {
						// if (!that.data.yuebao.length && !that.data.jibao.length && !that.data.nianbao.length && !that.data.rdlist.length) {
						// 	wx.redirectTo({
						// 		url: '/pages/error/error',
						// 	})
						// 	return
						// }

					} else {
						if (!res.data.arr_sj1[0].t2) {
							// if (!that.data.yuebao.length && !that.data.jibao.length && !that.data.nianbao.length && !that.data.rdlist.length) {
							// 	wx.redirectTo({
							// 		url: '/pages/error/error',
							// 	})
							// 	return
							// }
						}
					}
				})

				that.setData({
					arrval0: res.data.arr_type ? res.data.arr_type : [],
					arrval1: res.data.arr_ds ? res.data.arr_ds : [],
					arrval2: res.data.arr_xl ? res.data.arr_xl : [],
					arrval3: res.data.arr_yd ? res.data.arr_yd : [],
					xqData: res.data.arr_sj1 ? res.data.arr_sj1 : [],
					chart1: res.data.arr_sj2 ? res.data.arr_sj2.y : [],
					chart1x: res.data.arr_sj2 ? res.data.arr_sj2.x : [],
					chart2: res.data.arr_sj3 ? res.data.arr_sj3.y : [],
					chart2x: res.data.arr_sj3 ? res.data.arr_sj3.x : [],
					chart3: res.data.arr_sj4 ? res.data.arr_sj4 : [],
					chart4: res.data.arr_sj5 ? res.data.arr_sj5 : [],
					priceList: that.buildPriceList(res.data.arr_sj5 ? res.data.arr_sj5 : []),
					brandList: that.buildBrandList(res.data.arr_sj8 || [], res.data.arr_sj3 ? res.data.arr_sj3.x : [], res.data.arr_sj3 ? res.data.arr_sj3.y : []),
					arr_sj6: res.data.arr_sj6 ? res.data.arr_sj6 : [],
					tips: res.data.arr_sj ? res.data.arr_sj : '',
					kuanian: res.data.arr_sj2_num,
          arr_sj2_dw: res.data.arr_sj2_dw,
          is_ck:res.data.is_ck
				})
				setTimeout(() => {
					that.chuli()
					that.init()
					that.autorealval()
					let typename = that.changetitle()
					app.gethistory('首页-' + typename + '-数据', '/pages/index/next?type=' + type, 1)
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options && options.typename) {
			wx.setNavigationBarTitle({
				title: options.typename
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.ecComponent = this.selectComponent('#mychart-dom-bar');
		this.ecComponent2 = this.selectComponent('#mychart-dom-bar2');
		this.ecComponent3 = this.selectComponent('#mychart-dom-bar3');
		this.ecComponent4 = this.selectComponent('#mychart-dom-bar4');
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		app.checkws()
		let that = this
		var type = that.options.type
		if (that.options.typename) {
			wx.setNavigationBarTitle({
				title: that.options.typename
			})
		}
		console.log(type)
		that.setData({
			realval0: type,
		})
		var type2 = that.options.type2
		if (type2) {
			that.setData({
				realval1: type2,
			})
		}
		setTimeout(() => {
			that.init()
		}, 100);
		setTimeout(() => {
			that.getshuju()
		}, 100)
	},
	switchTab: function (e) {
		const tab = e.currentTarget.dataset.tab
		if (!tab || tab === this.data.activeTab) return
		this.setData({ activeTab: tab })
		setTimeout(() => {
			this.init()
		}, 60)
	},
	changetitle: function () {
		let that = this
		var type = that.options.type
		let selectedType = that.data.arrval0[that.data.val0]
		let typename = that.options.typename || (selectedType ? selectedType.name : '')
		console.log(typename)
		wx.setNavigationBarTitle({
			title: typename
		})
		return typename
		// app.gethistory('首页-'+typename+'-数据','/pages/index/next?type='+type,1)
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		
  },
	onShareTimeline: function () {
    
	},
	nextpage1: function (e) {
		let type = this.data.realval0
		console.log(type)
		let typename = this.data.arrval0[this.data.val0].name
		wx.redirectTo({
			url: '/pages/index/next1?type=' + type + '&typename=' + typename,
			success: (result) => { },
			fail: (res) => { },
			complete: (res) => { },
		})
	},
	nextpage2: function (e) {
		let type = this.data.realval0
		let typename = this.data.arrval0[this.data.val0].name
		console.log(type)
		wx.redirectTo({
			url: '/pages/index/next2?type=' + type + '&typename=' + typename,
			success: (result) => { },
			fail: (res) => { },
			complete: (res) => { },
		})
	},
})
