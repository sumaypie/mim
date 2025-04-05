# 画室模特招聘与管理小程序

## 项目概述

本小程序旨在提供画室模特招聘与管理服务，主要功能包括模特上班打卡、押金管理、信息上传以及导航功能。

## 用户角色

- **画室**：发布招聘信息，管理模特，查看打卡记录
- **模特**：查看招聘信息，上传个人信息，进行打卡，管理押金
- **客户**：浏览模特信息，查看画室位置

## 技术架构

### 前端
- 微信小程序原生开发
- WXML, WXSS, JavaScript

### 后端
- Node.js + Express.js
- 数据库：MongoDB

### 核心API
- 微信支付接口（押金管理）
- 微信地图API（定位打卡和导航）
- 云存储（图片上传）

## 数据库设计

### 用户表(User)
- _id: ObjectId
- openid: String (微信用户唯一标识)
- role: String (角色：'studio', 'model', 'customer')
- name: String
- phone: String
- avatar: String (头像URL)
- createTime: Date

### 画室表(Studio)
- _id: ObjectId
- userId: ObjectId (关联用户表)
- name: String (画室名称)
- address: String (详细地址)
- location: Object (经纬度坐标)
- description: String (画室描述)
- photos: Array (画室照片URL)
- contactPerson: String
- contactPhone: String
- workStartTime: String (上班时间，如"09:00")
- workEndTime: String (下班时间，如"17:00")
- checkInStartWindow: Number (上班打卡窗口分钟数，如30表示可提前30分钟打卡)
- checkInEndWindow: Number (上班打卡窗口分钟数，如30表示可延后30分钟打卡)
- checkOutStartWindow: Number (下班打卡窗口分钟数)
- checkOutEndWindow: Number (下班打卡窗口分钟数)
- depositAmount: Number (押金金额)

### 模特表(Model)
- _id: ObjectId
- userId: ObjectId (关联用户表)
- name: String
- gender: String
- age: Number
- height: Number
- weight: Number
- bust: Number (可选)
- waist: Number (可选)
- hip: Number (可选)
- experience: String (经验描述)
- photos: Array (照片URL)
- tags: Array (特点标签)
- introduction: String (自我介绍)

### 招聘信息表(Recruitment)
- _id: ObjectId
- studioId: ObjectId (关联画室表)
- title: String
- description: String
- requirements: String
- salary: Number
- workDate: Date
- workStartTime: String
- workEndTime: String
- status: String (状态：'open', 'closed')
- createTime: Date

### 应聘记录表(Application)
- _id: ObjectId
- recruitmentId: ObjectId (关联招聘信息表)
- modelId: ObjectId (关联模特表)
- status: String (状态：'pending', 'accepted', 'rejected', 'completed')
- depositId: String (押金记录ID，关联押金表)
- createTime: Date

### 打卡记录表(CheckRecord)
- _id: ObjectId
- applicationId: ObjectId (关联应聘记录表)
- modelId: ObjectId (关联模特表)
- studioId: ObjectId (关联画室表)
- checkInTime: Date (上班打卡时间)
- checkInLocation: Object (上班打卡位置)
- checkInStatus: String (上班打卡状态：'onTime', 'late', 'absent')
- checkOutTime: Date (下班打卡时间)
- checkOutLocation: Object (下班打卡位置)
- checkOutStatus: String (下班打卡状态：'onTime', 'early', 'absent')
- workDate: Date (工作日期)

### 押金表(Deposit)
- _id: ObjectId
- modelId: ObjectId (关联模特表)
- applicationId: ObjectId (关联应聘记录表)
- amount: Number (押金金额)
- paymentId: String (支付ID)
- status: String (状态：'paid', 'frozen', 'refunded', 'deducted')
- payTime: Date (支付时间)
- refundTime: Date (退款时间)
- remark: String (备注)

## 功能模块

### 用户认证模块
- 微信登录授权
- 用户角色选择与信息完善

### 画室管理模块
- 画室信息管理
- 招聘信息发布与管理
- 应聘记录查看
- 模特打卡记录查看

### 模特管理模块
- 个人信息与照片管理
- 招聘信息浏览与应聘
- 打卡功能（定位验证）
- 押金支付与查询

### 客户浏览模块
- 模特信息浏览
- 画室信息查看
- 导航功能

### 押金管理模块
- 押金支付接口
- 自动判断打卡状态
- 自动退还押金处理

## 关键业务流程

### 模特应聘流程
1. 模特浏览招聘信息
2. 提交应聘申请
3. 画室审核应聘申请
4. 审核通过后模特支付押金
5. 按约定时间到画室工作并打卡
6. 工作结束后打卡
7. 系统自动判断打卡状态并处理押金

### 打卡判断逻辑
1. 上班打卡时间在[约定时间-提前窗口, 约定时间+延后窗口]内视为准时
2. 下班打卡时间在[约定时间-提前窗口, 约定时间+延后窗口]内视为正常
3. 上班迟到或下班早退将影响押金退还

### 押金处理逻辑
1. 应聘成功后支付押金，状态为"已支付"
2. 确认工作当天，押金状态更新为"已冻结"
3. 打卡完成后，根据打卡状态自动处理押金：
   - 正常打卡：自动退还全部押金
   - 迟到/早退：根据规则扣除部分或全部押金
   - 未打卡：扣除全部押金