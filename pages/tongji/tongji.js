// pages/tongji/tongji.js
const app = getApp()
let userData = wx.getStorageSync('userData')
import * as echarts from '../../ec-canvas/echarts';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		sel: 1,
		yjn: 0,
		realyjn: 1,
		arryjn: [],
		yjn2: 0,
		realyjn2: 1,
		arryjn2: [],
		yjn3: 0,
		realyjn3: 1,
		arryjn3: [],
		yjn4: 0,
		realyjn4: 1,
    arryjn4: [],
    yjn5: 0,
		realyjn5: 1,
    arryjn5: [],
    yjn6: 0,
		realyjn6: 1,
    arryjn6: [],
    yjn7: 0,
		realyjn7: 1,
    arryjn7: [],
    yjn8: 0,
		realyjn8: 1,
    arryjn8: [],
    yjn9: 0,
		realyjn9: 1,
    arryjn9: [],
		listData: [],
		listData2: [],
		listData3: [],
    listData4: [],
    listData5: [],
    listData6: [],
    listData7: [],
    listData8: [],
    listData9: [],
		xqData: [
			{ "t1": "销量", "t2": "6400", "t3": "+20%" },
			{ "t1": "销额", "t2": "6400", "t3": "-20%" },
			{ "t1": "平均价格", "t2": "6400", "t3": "+20%" },
		],
		val0: 0,
		realval0: 1,
		arrval0: [
			// {
			// 	id: 1,
			// 	name: '智能投影'
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
		arrval1: [
			// {
			// 	id: 1,
			// 	name: '线上电商平台'
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
		val2: 0,
		realval2: 1,
		arrval2: [
			// {
			// 	id: 1,
			// 	name: '销量'
			// },

			// {
			// 	id: 2,
			// 	name: '销量2'
			// },
			// {
			// 	id: 3,
			// 	name: '销量3'
			// },
		],
		val3: 0,
		realval3: 1,
		arrval3: [
			// {
			// 	id: 1,
			// 	name: '月度'
			// },
			// {
			// 	id: 2,
			// 	name: '季度'
			// },
			// {
			// 	id: 3,
			// 	name: '年度'
			// },
		],
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
		tips: '',
		tips1: '',
		tips2: '',
		tips3: '',
		arr_sj2_dw: '',//市场规模单位
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
				barMaxWidth: 15,
				label: {
					normal: {
						show: false,
						position: 'top'
					}
				},
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
						formatter: '{value}%'
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
              return a.data.name + ' ' + (that.data.is_ck == 1 ?(parseFloat(a.percent).toFixed(1) + "%") : '');
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
							console.log(a)
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
	// 点击按钮后初始化图表
	init: function () {
		let that = this
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
		this.ecComponent.init((canvas, width, height, dpr) => {
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
		this.ecComponent2.init((canvas, width, height, dpr) => {
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
		this.ecComponent3.init((canvas, width, height, dpr) => {
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
		this.ecComponent4.init((canvas, width, height, dpr) => {
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
	// 截取字符串第一位
	jiequ: function (str) {
		// console.log(str)
		return str.substr(0, 1)
	},
	chuli: function () {
		var list = this.data.listData
		for (const key in list) {
			const item = list[key];
			item['t3zf'] = this.jiequ(item['t3'])
			item['t5zf'] = this.jiequ(item['t5'])
		}
		var list2 = this.data.listData2
		for (const key in list2) {
			const item = list2[key];
			item['t3zf'] = this.jiequ(item['t3'])
			item['t5zf'] = this.jiequ(item['t5'])
		}
		var list3 = this.data.listData3
		for (const key in list3) {
			const item = list3[key];
			item['t3zf'] = this.jiequ(item['t3'])
		}
		var list4 = this.data.listData4
		for (const key in list4) {
			const item = list4[key];
			item['t3zf'] = this.jiequ(item['t3'])
    }
    var list5 = this.data.listData5
		for (const key in list5) {
			const item = list5[key];
			item['t3zf'] = this.jiequ(item['t3'])
    }
    var list6 = this.data.listData6
		for (const key in list6) {
			const item = list6[key];
			item['t3zf'] = this.jiequ(item['t3'])
    }
    var list7 = this.data.listData7
		for (const key in list7) {
			const item = list7[key];
			item['t3zf'] = this.jiequ(item['t3'])
    }
    var list8 = this.data.listData8
		for (const key in list8) {
			const item = list8[key];
			item['t3zf'] = this.jiequ(item['t3'])
    }
    var list9 = this.data.listData9
		for (const key in list9) {
			const item = list9[key];
			item['t3zf'] = this.jiequ(item['t3'])
		}
		var xq = this.data.xqData
		for (const key in xq) {
			const item = xq[key];
			item['t3zf'] = this.jiequ(item['t3'])
		}
		this.setData({
			listData: list,
			listData2: list2,
			listData3: list3,
      listData4: list4,
      listData5: list5,
      listData6: list6,
      listData7: list7,
      listData8: list8,
      listData9: list9,
			xqData: xq,
		})
	},
	checkws2: function (args) {
		let that = this
		const userData = wx.getStorageSync('userData')
		if (userData) {
			return new Promise((resolve, reject) => {
				let id = userData.id
				wx.request({
					url: app.globalData.siteUrl + '/Wxapi/getuser',
					data: {
						id: id,
					},
					success: resolve,
					fail: reject
				})
			})
		} else {
			return false
		}

	},
	selchage: function (e) {
		let that = this
		let type = e.currentTarget.dataset.type
		let id = e.currentTarget.dataset.id
		// let res = that.checkws2()
		// console.log(res)
		const userData = wx.getStorageSync('userData')
		if (userData) {
			let uid = userData.id
			wx.request({
				url: app.globalData.siteUrl + '/Wxapi/getuser',
				data: {
					id: uid,
				},
				success: function (res) {
					if (type > 1) {//type 大于1时才判断是否需要完善信息
						if (res.data.status == 1) {
							if (res.data.userdata.is_xx == 0) {
								wx.showModal({
									title: '提示',
									content: '查看详细数据请先完善我的信息',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											wx.redirectTo({
												url: '/pages/user/myinfo',
											})
										}
									}
								})
								return
							}
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							})
							wx.clearStorage({
								success: (res) => {
									console.log(res)
								},
							})
							setTimeout(function () {
								wx.switchTab({
									url: '/pages/user/user',
								})
							}, 2000)
							return
						}
					}
					if (type > 1) {
						that.resetdspt()
						that.setData({
							val0: 0,
							realval0: '',
						})
					}
					that.setData({
						sel: type,
						realval0: id
					})
					setTimeout(() => {
						that.autorealval()
						if (type > 1) {
							that.getshuju(1)
						} else {
							that.getzonglan()
						}
					});
				}
			})
		} else if (!userData && type > 1) {
			wx.showModal({
				title: '提示',
				content: '查看详细数据请微信授权登录',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/user/user',
						})
					}
				}
			})
			return
		}

	},
	// 下拉框change
	bindPickerChange2: function (e) {
		console.log(e)
		let that = this
		let val = e.detail.value
		let name = e.target.dataset.name
		let real = e.target.dataset.real
		let type = e.target.dataset.type
		let realval = that.data['arr' + type][val].id
		that.setData({
			[name]: val,
			[real]: realval
		})

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
		if (name == 'yjn' || name == 'yjn2' || name == 'yjn3' || name == 'yjn4' || name == 'yjn5' || name == 'yjn6' || name == 'yjn7' || name == 'yjn8' || name == 'yjn9') {
			setTimeout(() => { that.getzonglan() })
		} else if (name == 'val0') {
			that.resetdspt()
			setTimeout(() => { that.getshuju(1) })
		} else if (name == 'val1') {
			that.resetdspt(1)
			setTimeout(() => { that.getshuju(1) })
		} else {
			setTimeout(() => { that.getshuju(1) })
		}
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
	getzonglan: function () {
		let that = this
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getdatas',
			data: {
				'sel_yd': that.data.realyjn,
				'sel_yd2': that.data.realyjn2,
				'sel_yd3': that.data.realyjn3,
        'sel_yd4': that.data.realyjn4,
        'sel_yd5': that.data.realyjn5,
        'sel_yd6': that.data.realyjn6,
        'sel_yd7': that.data.realyjn7,
        'sel_yd8': that.data.realyjn8,
        'sel_yd9': that.data.realyjn9,
			},
			success(res) {
				console.log(res)
				that.setData({
					arr_sj1: res.data.arr_sj1,
					listData: res.data.arr_sj2,
					arr_sj3: res.data.arr_sj3,
					listData2: res.data.arr_sj4,
					listData3: res.data.arr_sj5,
          listData4: res.data.arr_sj6,
          listData5: res.data.arr_sj7,
          listData6: res.data.arr_sj8,
          listData7: res.data.arr_sj9,
          listData8: res.data.arr_sj10,
          listData9: res.data.arr_sj11,
					tips1: res.data.arr_jg1,
					tips2: res.data.arr_jg2,
					tips3: res.data.arr_jg3,
					arryjn: res.data.arr_ss1,
					arryjn2: res.data.arr_ss2,
					arryjn3: res.data.arr_ss3,
          arryjn4: res.data.arr_ss4,
          arryjn5: res.data.arr_ss5,
          arryjn6: res.data.arr_ss6,
          arryjn7: res.data.arr_ss7,
          arryjn8: res.data.arr_ss8,
          arryjn9: res.data.arr_ss9,
				})
				setTimeout(() => {
					that.chuli()
				})
			}
		})
		app.gethistory('数据-总览', '/pages/tongji/tongji', 2)
	},
	// 获取下拉内容和统计内容
	getshuju: function (type1) {
		let that = this
		let sel = that.data.sel
		let type = that.data.realval0
		let sel_ds = that.data.realval1
		let sel_xl = that.data.realval2
		let sel_yd = that.data.realval3
    console.log('===============type:' + type + '=================')
    const userData = wx.getStorageSync('userData')
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getshuju',
			data: {
				type: type,
				sel_ds: sel_ds,
				sel_xl: sel_xl,
        sel_yd: sel_yd,
        uid:userData.id?userData.id:0
			},
			success(res) {
				if (!res.data.arr_sj1) {
					// wx.navigateTo({
					//   url: '/pages/error/error',
					// })
				} else {
					// if(!res.data.arr_sj1[0].t2){
					// 	wx.navigateTo({
					// 		url: '/pages/error/error',
					// 	  })
					// }
				}
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
					arr_sj6: res.data.arr_sj6 ? res.data.arr_sj6 : [],
					tips: res.data.arr_sj ? res.data.arr_sj : '',
					kuanian: res.data.arr_sj2_num,
          arr_sj2_dw: res.data.arr_sj2_dw,
          is_ck:res.data.is_ck
				})
				setTimeout(() => {
					that.chuli()
					that.init()
					if (type1 == 1) {
						let val = that.data.val0
						app.gethistory('数据-' + that.data.arrval0[val].name, '/pages/tongji/tongji?type=' + type + '##sel=' + sel, 2)
					}

				})
			}
		})
	},
	// 重置电商平台选项
	resetdspt: function (type = 0) {
		let that = this
		that.setData({
			val2: 0,
			realval2: '',
			val3: 0,
			realval3: '',
		})
		if (type != 1) {
			that.setData({
				val1: 0,
				realval1: '',
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    // userData = wx.getStorageSync('userData')
    console.log('####################################################')
    console.log(userData)
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
		let that = this
		let sjtype = wx.getStorageSync('sjtype')
		let sjsel = wx.getStorageSync('sjsel')
		console.log(sjtype, sjsel)
		if (sjtype && sjsel) {
			that.setData({
				realval0: sjtype,
				sel: sjsel
			})
			wx.setStorageSync('sjtype', null)
			wx.setStorageSync('sjsel', null)
		}
		// setTimeout(function(){
		if (sjsel) {
			var sel = sjsel
		} else {
			var sel = that.data.sel
		}
		if (sel > 1) {
			app.checkws()
			
			that.resetdspt(1)
			that.autorealval()
			setTimeout(() => { that.getshuju(1) })
			
		} else {
			that.chuli()
			that.autorealval()
			that.getzonglan()
		}


		// },1000)

		// setTimeout(() => {
		// 	that.init()
		// }, 100);
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		// console.log('隐藏')
		this.setData({
			sel: 1
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		// console.log('卸载')
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		let that = this
		// let chart1 = that.data.chart2
		// that.setData({
		// 	chart1
		// })
		// that.init()
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
  tiaozhuan: function (e) {
    let that = this
    let sel = e.target.dataset.type
    let realval0 = e.target.dataset.id
    let val0 = e.target.dataset.ids
    let realval1 = e.target.dataset.ds
    let val1 = e.target.dataset.dss
    const userData = wx.getStorageSync('userData')
		if (userData) {
			let uid = userData.id
			wx.request({
				url: app.globalData.siteUrl + '/Wxapi/getuser',
				data: {
					id: uid,
				},
				success: function (res) {
						if (res.data.status == 1) {
							if (res.data.userdata.is_xx == 0) {
								wx.showModal({
									title: '提示',
									content: '查看详细数据请先完善我的信息',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											wx.redirectTo({
												url: '/pages/user/myinfo',
											})
										}
									}
								})
								return
              }
              that.resetdspt()
              that.setData({
                sel,
                realval0,
                val0,
                realval1:realval1?realval1:'',
                val1:val1?val1:0
              })
              setTimeout(() => { that.getshuju(1) })
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							})
							wx.clearStorage({
								success: (res) => {
									console.log(res)
								},
							})
							setTimeout(function () {
								wx.switchTab({
									url: '/pages/user/user',
								})
							}, 2000)
							return
						}
					
				}
			})
		} else if (!userData && sel > 1) {
			wx.showModal({
				title: '提示',
				content: '查看详细数据请微信授权登录',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/user/user',
						})
					}
				}
			})
			return
		}
    
  }
})