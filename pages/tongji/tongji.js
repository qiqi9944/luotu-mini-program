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
		groupList: [],
		arr_groups: [],
		curTypes: [],
		curGroupName: '',
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
		ytdIndex: 0,
		ytdOptions: [
			{ id: 0, name: '当期' },
			{ id: 1, name: '年累计' }
		],
		activeTab: 'scale',
		chartYoy: [],
		chartMom: [],
		chartYoy2: [],
		chartMom2: [],
		priceList: [],
		brandList: [],
		price_dist: 1,
		aiSummary: [],
	},
	formatPercent: function (value) {
		const num = Number(value)
		if (!isFinite(num)) return '--'
		return `${num.toFixed(1)}%`
	},
	// 统一百分比显示：符号 + 1 位小数 + %
	fmtPct: function (value) {
		if (value === null || value === undefined || value === '' || value === '--' || value === '-') return '--'
		const s = String(value)
		const sign = s.charAt(0) === '+' || s.charAt(0) === '-' ? s.charAt(0) : ''
		const num = parseFloat(s)
		if (!isFinite(num)) return '--'
		return sign + Math.abs(num).toFixed(1) + '%'
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
				const change = item && item.t3 ? this.fmtPct(item.t3) : '--'
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
			const change = item.t3 ? this.fmtPct(item.t3) : '--'
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
	buildBrandList: function (list, fallbackX, fallbackY) {
		if (Array.isArray(list) && list.length) {
			return list.map((item) => {
				const shareRaw = item.share !== undefined && item.share !== '' ? String(item.share) : '--'
				const shareCRaw = item.share_c !== undefined && item.share_c !== '' ? String(item.share_c) : '--'
				const price = item.price !== undefined && item.price !== '' ? String(item.price) : '--'
				const priceCRaw = item.price_c !== undefined && item.price_c !== '' ? String(item.price_c) : '--'
				return {
					name: item.name || '--',
					share: shareRaw === '--' ? '--' : this.fmtPct(shareRaw),
					share_c: shareCRaw === '--' ? '--' : this.fmtPct(shareCRaw),
					share_czf: shareCRaw === '--' ? '' : shareCRaw.charAt(0),
					price,
					price_c: priceCRaw === '--' ? '--' : this.fmtPct(priceCRaw),
					price_czf: priceCRaw === '--' ? '' : priceCRaw.charAt(0),
				}
			})
		}
		const x = fallbackX || []
		const y = fallbackY || []
		if (x.length) {
			return x.map((name, i) => ({
				name,
				share: y[i] !== undefined ? this.fmtPct(y[i]) : '--',
				share_c: '--',
				share_czf: '',
				price: '--',
				price_c: '--',
				price_czf: '',
			}))
		}
		return []
	},
	buildAiSummary: function (response, chartYoy, brandList, productList, priceList) {
		const trend = response && response.arr_sj2 ? response.arr_sj2 : {}
		const firstValid = (values) => {
			if (!Array.isArray(values)) return null
			for (let i = 0; i < values.length; i++) {
				if (values[i] === null || values[i] === undefined || values[i] === '') continue
				const value = Number(values[i])
				if (isFinite(value)) return value
			}
			return null
		}
		const formatRate = (value) => {
			if (value === null || value === undefined || !isFinite(Number(value))) return '--'
			return (Number(value) > 0 ? '+' : '') + Number(value).toFixed(1) + '%'
		}
		const rate = firstValid(chartYoy || trend.yoy)
		const scaleName = this.data.arrval2[this.data.val2] ? this.data.arrval2[this.data.val2].name : '销量'
		const brandRows = Array.isArray(brandList) ? brandList.slice(0, 20) : []
		const risingBrands = brandRows.filter((item) => {
			const value = parseFloat(String(item.share_c || '').replace('%', ''))
			return isFinite(value) && value > 0
		}).length
		const brandChanges = brandRows.filter((item) => isFinite(parseFloat(String(item.share_c || '').replace('%', '')))).length
		const productRows = Array.isArray(productList) ? productList : []
		const priceRows = Array.isArray(priceList) ? priceList : []
		const topProduct = productRows.length ? productRows[0].name : ''
		const productName = response && response.arr_sj6 && response.arr_sj6.t1 ? response.arr_sj6.t1 : '产品类型'
		const risingPriceRanges = priceRows.filter((item) => String(item.t3 || '').charAt(0) === '+').length
		return [
			{
				key: 'scale',
				title: '行业规模',
				icon: '↗',
				before: scaleName + '同比',
				value: rate === null ? '--' : (rate > 0 ? '上升 ' : rate < 0 ? '下降 ' : '持平 '),
				highlight: rate === null ? '--' : formatRate(rate),
				tone: rate === null ? 'muted' : rate < 0 ? 'down' : 'up'
			},
			{
				key: 'brand',
				title: '畅销品牌',
				icon: '◆',
				before: 'TOP20品牌中',
				value: brandChanges ? risingBrands + '个品牌' : '',
				after: brandChanges ? '市占同比上升' : '暂无同比数据',
				highlight: '',
				tone: brandChanges ? 'up' : 'muted'
			},
			{
				key: 'product',
				title: '产品趋势',
				icon: '☷',
				before: topProduct ? topProduct + productName + '占比最高' : '产品结构暂无数据',
				value: productRows.length ? risingPriceRanges + '种产品规格' : '',
				after: productRows.length ? '占比同比上升' : '',
				highlight: '',
				tone: productRows.length ? 'up' : 'muted'
			},
			{
				key: 'price',
				title: '价格趋势',
				icon: '▥',
				before: priceRows.length ? risingPriceRanges + '个价格段' : '价格分布暂无数据',
				value: priceRows.length ? '占比同比上升' : '',
				highlight: '',
				tone: priceRows.length ? 'up' : 'muted'
			}
		]
	},
	setOption: function (chart) {
		let that = this
		var data = this.data.chart1x
		chart.clear()
		const changeId = this.data.changeOptions && this.data.changeOptions[this.data.changeIndex] ? this.data.changeOptions[this.data.changeIndex].id : 'yoy'
		const showYoy = changeId === 'yoy'
		const legendData = [showYoy ? '同比' : '环比']
		const lineSeries = []
		if (showYoy) {
			lineSeries.push({
				name: '同比',
				type: 'line',
				yAxisIndex: 1,
				z: 10,
				connectNulls: true,
				data: this.data.chartYoy,
				smooth: false,
				symbol: 'circle',
				symbolSize: 3.5,
				lineStyle: {
					width: 1.5,
					color: '#e04a5c'
				},
				itemStyle: {
					color: '#e04a5c',
					borderColor: '#ffffff',
					borderWidth: 1
				},
				label: {
					show: false
				}
			})
		} else {
			lineSeries.push({
				name: '环比',
				type: 'line',
				yAxisIndex: 1,
				z: 10,
				connectNulls: true,
				data: this.data.chartMom,
				smooth: false,
				symbol: 'circle',
				symbolSize: 3.5,
				lineStyle: {
					width: 1.5,
					color: '#f39c3d'
				},
				itemStyle: {
					color: '#f39c3d',
					borderColor: '#ffffff',
					borderWidth: 1
				},
				label: {
					show: false
				}
			})
		}
		const option = {
			tooltip: {
				trigger: 'axis',
				triggerOn: 'click',
				axisPointer: {
					type: 'line',
					lineStyle: {
						color: '#c8d3df',
						type: 'dashed'
					}
				},
				backgroundColor: 'rgba(255,255,255,0.96)',
				borderColor: '#e2e8f0',
				borderWidth: 1,
				padding: [8, 12],
				textStyle: {
					color: '#1f2a37',
					fontSize: 11
				},
				formatter: function (val) {
					if (!val || !val.length) return ''
					const rows = [val[0].name]
					val.forEach((item) => {
						if (item.value === null || item.value === undefined || item.value === '-') return
						const unit = item.seriesType === 'line' ? '%' : that.data.arr_sj2_dw
						const num = Number(item.value)
						const display = item.seriesType === 'line' && isFinite(num) ? num.toFixed(1) : item.value
						rows.push(item.marker + item.seriesName + '：' + display + unit)
					})
					return rows.join('\n')
				}
			},
			legend: {
				show: true,
				data: legendData,
				top: 0,
				right: 4,
				icon: 'circle',
				itemWidth: 8,
				itemHeight: 8,
				itemGap: 12,
				textStyle: {
					color: '#64748b',
					fontSize: 10
				}
			},
			grid: {
				left: 2,
				right: 12,
				bottom: 0,
				top: 36,
				containLabel: true,
			},
			xAxis: [
				{
					type: 'category',
					axisTick: { show: false },
					data: data,
					axisLine: { show: false },
					axisLabel: {
						color: '#8a97a7',
						fontSize: 10,
						interval: 0,
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
						show: true,
						lineStyle: {
							color: '#eef2f6',
							type: 'dashed'
						}
					},
					axisLine: { show: false },
					axisLabel: {
						color: '#8a97a7',
						fontSize: 10
					}
				},
				{
					type: 'value',
					scale: true,
					splitLine: { show: false },
					axisLine: { show: false },
					axisLabel: {
						color: '#aab6c4',
						fontSize: 10,
						formatter: '{value}%'
					}
				}
			],
			series: [{
				name: this.data.arrval2[this.data.val2] ? this.data.arrval2[this.data.val2].name : '销量',
				type: 'bar',
				label: {
					show: false,
					position: 'top'
				},
				barMaxWidth: 14,
				data: this.data.chart1,
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
					color: {
						type: 'linear',
						colorStops: [{
							offset: 0, color: '#3d9bbd'
						}, {
							offset: 1, color: '#005d99'
						}],
					},
				}
			}].concat(lineSeries)
		};
			chart.setOption(option, true);
	},

	setOption2: function (chart) {
		let that = this
		chart.clear()
		const changeId = this.data.changeOptions && this.data.changeOptions[this.data.changeIndex] ? this.data.changeOptions[this.data.changeIndex].id : 'yoy'
		const showYoy = changeId === 'yoy'
		const legendData = [showYoy ? '同比' : '环比']
		const lineSeries = []
		if (showYoy) {
			lineSeries.push({
				name: '同比',
				type: 'line',
				yAxisIndex: 1,
				z: 10,
				connectNulls: true,
				data: this.data.chartYoy2,
				smooth: false,
				symbol: 'circle',
				symbolSize: 3.5,
				lineStyle: {
					width: 1.5,
					color: '#e04a5c'
				},
				itemStyle: {
					color: '#e04a5c',
					borderColor: '#ffffff',
					borderWidth: 1
				},
				label: {
					show: false
				}
			})
		} else {
			lineSeries.push({
				name: '环比',
				type: 'line',
				yAxisIndex: 1,
				z: 10,
				connectNulls: true,
				data: this.data.chartMom2,
				smooth: false,
				symbol: 'circle',
				symbolSize: 3.5,
				lineStyle: {
					width: 1.5,
					color: '#f39c3d'
				},
				itemStyle: {
					color: '#f39c3d',
					borderColor: '#ffffff',
					borderWidth: 1
				},
				label: {
					show: false
				}
			})
		}
		const option = {
			tooltip: {
				trigger: 'axis',
				triggerOn: 'click',
				axisPointer: {
					type: 'line',
					lineStyle: {
						color: '#c8d3df',
						type: 'dashed'
					}
				},
				backgroundColor: 'rgba(255,255,255,0.96)',
				borderColor: '#e2e8f0',
				borderWidth: 1,
				padding: [8, 12],
				textStyle: {
					color: '#1f2a37',
					fontSize: 11
				},
				formatter: function (val) {
					if (!val || !val.length) return ''
					const rows = [val[0].name]
					val.forEach((item) => {
						if (item.value === null || item.value === undefined || item.value === '-') return
						const unit = item.seriesType === 'line' ? '%' : '元'
						const num = Number(item.value)
						const display = item.seriesType === 'line' && isFinite(num) ? num.toFixed(1) : item.value
						rows.push(item.marker + item.seriesName + '：' + display + unit)
					})
					return rows.join('\n')
				}
			},
			legend: {
				show: true,
				data: legendData,
				top: 0,
				right: 4,
				icon: 'circle',
				itemWidth: 8,
				itemHeight: 8,
				itemGap: 12,
				textStyle: {
					color: '#64748b',
					fontSize: 10
				}
			},
			grid: {
				left: 2,
				right: 12,
				bottom: 0,
				top: 36,
				containLabel: true,
			},
			xAxis: [
				{
					type: 'category',
					axisTick: { show: false },
					data: this.data.chart2x,
					axisLine: { show: false },
					axisLabel: {
						color: '#8a97a7',
						fontSize: 10,
						interval: 0,
						formatter: function (val, index) {
							if (val.length > 4) {
								if (index == 0 || index == that.data.chart2x.length - 1) {
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
						show: true,
						lineStyle: {
							color: '#eef2f6',
							type: 'dashed'
						}
					},
					axisLine: { show: false },
					axisLabel: {
						color: '#8a97a7',
						fontSize: 10
					}
				},
				{
					type: 'value',
					scale: true,
					splitLine: { show: false },
					axisLine: { show: false },
					axisLabel: {
						color: '#aab6c4',
						fontSize: 10,
						formatter: '{value}%'
					}
				}
			],
			series: [{
				name: '均价',
				type: 'bar',
				barMaxWidth: 14,
				label: {
					show: false,
					position: 'top'
				},
				data: this.data.chart2,
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
					color: {
						type: 'linear',
						colorStops: [{
							offset: 0, color: '#3d9bbd'
						}, {
							offset: 1, color: '#005d99'
						}],
					},
				}
			}].concat(lineSeries)
		};
			chart.setOption(option, true);
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
					avoidLabelOverlap: true,
					minShowLabelAngle: 5,
					labelLine: {
						show: true,
						smooth: true,
						length: 8,
						length2: 4
					},
					label: {
            // show: that.data.is_ck == 1 ? true : false,
						// formatter: '{b} {d}%',
						color: '#333',
						fontSize: 11,
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
					labelLayout: {
						hideOverlap: true,
						moveOverlap: 'shiftY'
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
					avoidLabelOverlap: true,
					minShowLabelAngle: 5,
					labelLine: {
						show: true,
						smooth: true,
						length: 8,
						length2: 4
					},
					label: {
            // show: that.data.is_ck == 1 ? true : false,
						// formatter: '{b} {d}%',
						color: '#333',
						fontSize: 11,
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
					labelLayout: {
						hideOverlap: true,
						moveOverlap: 'shiftY'
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
		this.ecComponent = this.selectComponent('#mychart-dom-bar');
		this.ecComponent2 = this.selectComponent('#mychart-dom-bar2');
		this.ecComponent3 = this.selectComponent('#mychart-dom-bar3');
		this.ecComponent4 = this.selectComponent('#mychart-dom-bar4');
		if (this.chart) {
			this.chart.dispose();
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
	ensureMenu: function (cb) {
		let that = this
		if (that.data.groupList && that.data.groupList.length) {
			if (cb) cb()
			return
		}
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getindexmenu',
			success(res) {
				const dl = (res.data && res.data.datalist) || []
				// 与首页宫格同一套图标映射：分类 type → 图标 class（图形见 tongji.wxss 的 .svg-*）
				const iconClassMap = {
					1: 'ent', 14: 'edu', 2: 'work', 3: 'wear', 5: 'secure',
					6: 'sport', 7: 'screen', 18: 'life', 9: 'core'
				}
				const gl = dl.map((m, i) => ({
					sel: i + 2,
					id: m.id,
					type: m.type,
					name: m.name || ('组' + (i + 1)),
					iconClass: iconClassMap[m.type] || 'more',
					types: (m.types || []).map((t) => ({ id: String(t.id), name: t.name }))
				}))
				that.setData({ groupList: gl }, () => { if (cb) cb() })
			},
			fail() {
				if (cb) cb()
			}
		})
	},
	selchage: function (e) {
		let that = this
		let sel = Number(e.currentTarget.dataset.type)
		let id = e.currentTarget.dataset.id
		const userData = wx.getStorageSync('userData')
		if (sel > 1 && !userData) {
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
		const enter = () => {
			const group = that.data.groupList.find((g) => g.sel == sel) || {}
			if (sel > 1) {
				that.resetdspt()
				that.setData({
					val0: 0,
					realval0: id || '',
				})
			}
			that.setData({
				sel: sel,
				realval0: id || that.data.realval0,
				curTypes: group.types || [],
				curGroupName: group.name || '',
			})
			setTimeout(() => {
				that.autorealval()
				if (sel > 1) {
					that.getshuju(1)
				} else {
					that.chuli()
					that.getzonglan()
				}
			})
		}
		if (sel > 1) {
			wx.request({
				url: app.globalData.siteUrl + '/Wxapi/getuser',
				data: {
					id: userData.id,
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
						enter()
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
					}
				}
			})
		} else {
			enter()
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
	bindLocalPickerChange: function (e) {
		const name = e.currentTarget.dataset.name
		const value = Number(e.detail.value)
		if (name === 'ytdIndex') {
			const patch = { ytdIndex: value }
			const arr = this.data.arrval3 || []
			if (arr.length) {
				if (value === 1) {
					const last = arr.length - 1
					patch.val3 = last
					patch.realval3 = arr[last].id
				} else {
					patch.val3 = 0
					patch.realval3 = arr[0].id
				}
			}
			this.setData(patch, () => {
				this.getshuju(1)
			})
			return
		}
		this.setData({
			[name]: value
		}, () => {
			this.getshuju(1)
		})
	},
	switchTab: function (e) {
		const tab = e.currentTarget.dataset.tab
		if (!tab || tab === this.data.activeTab) return
		this.setData({ activeTab: tab })
		setTimeout(() => {
			this.init()
		}, 60)
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
				const normalizeRow = (row) => {
					if (!row) return row
					const clone = Object.assign({}, row)
					;['t3', 't5'].forEach(k => {
						if (clone[k] !== undefined && clone[k] !== '' && clone[k] !== '--') clone[k] = that.fmtPct(clone[k])
					})
					return clone
				}
				const groups = (res.data.arr_groups || []).map((g, i) => {
					const sj2 = (g.sj2 || []).map((row) => {
						const norm = normalizeRow(row)
						return Object.assign({}, norm, {
							t3zf: norm.t3 ? norm.t3.substr(0, 1) : '',
							t5zf: norm.t5 ? norm.t5.substr(0, 1) : ''
						})
					})
					const sj1 = g.sj1 ? Object.assign({}, g.sj1) : {}
					;['xlbfb', 'xebfb'].forEach(k => {
						if (sj1[k] !== undefined && sj1[k] !== '' && sj1[k] !== '--') sj1[k] = that.fmtPct(sj1[k])
					})
					return Object.assign({}, g, { sel: i + 2, sj2, sj1 })
				})
				const listData3 = (res.data.arr_sj5 || []).map(normalizeRow)
				const listData4 = (res.data.arr_sj6 || []).map(normalizeRow)
				const listData5 = (res.data.arr_sj7 || []).map(normalizeRow)
				const listData6 = (res.data.arr_sj8 || []).map(normalizeRow)
				const listData7 = (res.data.arr_sj9 || []).map(normalizeRow)
				const listData8 = (res.data.arr_sj10 || []).map(normalizeRow)
				const listData9 = (res.data.arr_sj11 || []).map(normalizeRow)
				that.setData({
					arr_groups: groups,
					arr_sj1: res.data.arr_sj1,
					listData: res.data.arr_sj2,
					arr_sj3: res.data.arr_sj3,
					listData2: res.data.arr_sj4,
					listData3,
					listData4,
					listData5,
					listData6,
					listData7,
					listData8,
					listData9,
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
				sel_period: that.data.periodOptions[that.data.periodIndex].id,
				sel_ytd: that.data.ytdOptions[that.data.ytdIndex].id,
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
				const scaleData = res.data.arr_sj2 || {}
				const fallbackChange = (values) => {
					if (!Array.isArray(values)) return []
					return values.map((value, index) => {
						const current = parseFloat(value)
						const previous = parseFloat(values[index - 1])
						if (index === 0 || !isFinite(current) || !isFinite(previous) || previous === 0) return null
						return Number(((current - previous) / previous * 100).toFixed(1))
					})
				}
				const normalizeChange = (values) => {
					if (!Array.isArray(values)) return []
					return values.map((value) => {
						const number = parseFloat(value)
						return isFinite(number) ? Math.round(number * 10) / 10 : null
					})
				}
				const hasNumericValues = (values) => normalizeChange(values).some((value) => value !== null)
				const chartYoy = hasNumericValues(scaleData.yoy) ? normalizeChange(scaleData.yoy) : fallbackChange(scaleData.y)
				const chartMom = hasNumericValues(scaleData.mom) ? normalizeChange(scaleData.mom) : fallbackChange(scaleData.y)
				const chartYoy2 = hasNumericValues(scaleData.avg_yoy) ? normalizeChange(scaleData.avg_yoy) : fallbackChange(scaleData.avg)
				const chartMom2 = hasNumericValues(scaleData.avg_mom) ? normalizeChange(scaleData.avg_mom) : fallbackChange(scaleData.avg)
				const hasAveragePrice = Array.isArray(scaleData.avg) && scaleData.avg.some((value) => value !== null && value !== undefined)
				const brandList = that.buildBrandList(res.data.arr_sj8 || [], res.data.arr_sj3 ? res.data.arr_sj3.x : [], res.data.arr_sj3 ? res.data.arr_sj3.y : [])
				const priceList = that.buildPriceList(res.data.arr_sj5 ? res.data.arr_sj5 : [])
				const aiSummary = that.buildAiSummary(res.data, chartYoy, brandList, res.data.arr_sj4 ? res.data.arr_sj4 : [], priceList)
				that.setData({
					arrval0: that.data.curTypes && that.data.curTypes.length ? that.data.curTypes : (res.data.arr_type ? res.data.arr_type : []),
					arrval1: res.data.arr_ds ? res.data.arr_ds : [],
					arrval2: res.data.arr_xl ? res.data.arr_xl : [],
					arrval3: res.data.arr_yd ? res.data.arr_yd : [],
					xqData: res.data.arr_sj1 ? res.data.arr_sj1.map(row => {
						if (!row || row.t3 === undefined || row.t3 === '') return row
						return Object.assign({}, row, { t3: that.fmtPct(row.t3) })
					}) : [],
					chart1: scaleData.y || [],
					chartYoy: chartYoy,
					chartMom: chartMom,
					chart1x: scaleData.x || [],
					chart2: scaleData.avg || [],
					chart2x: hasAveragePrice ? (scaleData.x || []) : [],
					chartYoy2: chartYoy2,
					chartMom2: chartMom2,
					chart3: res.data.arr_sj4 ? res.data.arr_sj4 : [],
					chart4: res.data.arr_sj5 ? res.data.arr_sj5 : [],
					priceList: priceList,
					brandList: brandList.slice(0, 10),
					price_dist: res.data.price_dist !== undefined ? res.data.price_dist : 1,
					aiSummary: aiSummary,
					arr_sj6: res.data.arr_sj6 ? res.data.arr_sj6 : [],
					tips: res.data.arr_sj ? res.data.arr_sj : '',
					kuanian: res.data.arr_sj2_num,
          arr_sj2_dw: res.data.arr_sj2_dw,
          is_ck:res.data.is_ck
				})
				setTimeout(() => {
					that.autorealval()
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
				sel: Number(sjsel)
			})
			wx.setStorageSync('sjtype', null)
			wx.setStorageSync('sjsel', null)
		}
		that.ensureMenu(() => {
			const sel = that.data.sel
			const group = that.data.groupList.find((g) => g.sel == sel)
			that.setData({
				curTypes: group ? group.types : [],
				curGroupName: group ? group.name : '',
			})
			if (sel > 1) {
				app.checkws()
				that.resetdspt(1)
				that.autorealval()
				setTimeout(() => { that.getshuju(1) })
			} else {
				that.chuli()
				that.autorealval()
				setTimeout(() => { that.getzonglan() })
			}
		})
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
    let sel = e.currentTarget.dataset.type
    let realval0 = e.currentTarget.dataset.id
    let val0 = e.currentTarget.dataset.ids
    let realval1 = e.currentTarget.dataset.ds
    let val1 = e.currentTarget.dataset.dss
    let typename = e.currentTarget.dataset.typename
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
              wx.navigateTo({
                url: '/pages/index/next?type=' + realval0 +
                  '&type2=' + (realval1 || '') +
                  '&typename=' + encodeURIComponent(typename || '')
              })
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
