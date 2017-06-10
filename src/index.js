import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'
import '../semantic/dist/semantic.min.css';

let TO_ANSWER_GROUPS = [
	{
		startPage: {
			titleText: '請記住以下看到的水果',
			buttonText: '開始'
		},
		beforeAnswerPage: {
			titleText: '接下來請以一分鐘盡量回答記得的水果',
		},
		answerPage: {
			titleText: '請回答記得的水果'
		},
		tokenGroups: [
			{
				// STANDARD: ["蘋果", "香蕉", "芭樂", ],
				// NONE_STANDARD: ["甘蔗", "枇杷"]
				STANDARD: ["蘋果", "香蕉", "芭樂", "西瓜", "葡萄", "鳳梨", "芒果", "草莓", "橘子", "奇異果", "水蜜桃", "荔枝", "柳丁", "水梨", "木瓜"],
				NONE_STANDARD: ["甘蔗", "枇杷", "仙桃", "黑醋栗", "神秘果", "石蓮", "波蘿蜜", "無花果", "覆盆子", "椰子", "酪梨", "山竹", "紅毛丹", "桑椹", "椰棗"]

			}
		]
	},
	{
		startPage: {
			titleText: '做完一半了！接下來，請記住以下看到的蔬菜',
			buttonText: '開始'
		},
		beforeAnswerPage: {
			titleText: '接下來請以一分鐘盡量回答記得的蔬菜',
		},
		answerPage: {
			titleText: '請回答記得的蔬菜'
		},
		tokenGroups: [
			{
				// STANDARD: ["高麗菜", "空心菜", "花椰菜"],
				// NONE_STANDARD: ["山葵", "山蘇", ]
				STANDARD: ["高麗菜", "空心菜", "花椰菜", "地瓜葉", "青江菜", "大陸妹", "小白菜", "菠菜", "茄子", "大白菜", "紅蘿蔔", "青椒", "番茄", "A菜", "小黃瓜", "龍鬚菜", "芹菜", "茼蒿", "馬鈴薯", "豆芽菜", "絲瓜", "莧菜", "蔥", "玉米", "苦瓜"],
				NONE_STANDARD: ["山葵", "山蘇", "茭白筍", "苜蓿芽", "紫蘇"]
			},
			{
				// STANDARD: ["高麗菜", "空心菜", "花椰菜"],
				// NONE_STANDARD: ["芥菜", "豆苗"]
				STANDARD: ["高麗菜", "空心菜", "花椰菜", "地瓜葉", "青江菜"],
				NONE_STANDARD: ["芥菜", "豆苗", "毛豆", "辣椒", "櫛瓜", "牛蒡", "薑", "地瓜", "菜心", "山葵", "山蘇", "朝鮮薊", "皇宮菜", "娃娃菜", "紅鳳菜", "茭白筍", "芝麻葉", "苜蓿芽", "甜菜", "芋頭", "玉米筍", "紫蘇", "瓠瓜", "蘆薈", "佛手瓜"]
			}
		]
	},

]


render(
    <App groups={TO_ANSWER_GROUPS}/>,
	document.getElementById('root')
)
