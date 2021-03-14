import React from 'react'
import axios from "axios"
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
//import ImgCrop from 'antd-img-crop';

import {apiRequest} from "../utils.js"

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

export default class UploaderTest extends React.Component {
	state = {
		previewVisible: false,
		previewImage: '',
		previewTitle: '',
		fileList: [
			{
				uid: 2,
				name: 'картинка',
				url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			},
			{
				uid: '-3',
				name: 'image.png',
				status: 'done',
				url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			},
			{
				uid: '-xxx',
				percent: 50,
				name: 'image.png',
				status: 'uploading',
				url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			},
			{
				uid: '-5',
				name: 'image.png',
				status: 'error',
			},
		],
	};

	componentDidMount() {
		//console.log(this.props)
	}

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = async file => {
		if (!file.url && !file.preview) {
		  file.preview = await getBase64(file.originFileObj);
		}

		this.setState({
		  previewImage: file.url || file.preview,
		  previewVisible: true,
		  previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
		});
	};

	handleChange = ({ fileList }) => this.setState({ fileList });

	uploadImage = async options => {
		console.log(options)
		const {onSuccess, onError, file, onProgress, action} = options;

		const config = {
			//headers: { "content-type": "multipart/form-data" },
			onUploadProgress: event => {
				const percent = Math.floor((event.loaded / event.total) * 100);
				//setProgress(percent);
				onProgress({percent});
			}
		};
		const {objId, objType} = this.props
		apiRequest('upload_image', {image: file, objId, objType}, config)
		.then(res => {
			this.props.afterUpdate()
		})		
		/*
		const fmData = new FormData();
		fmData.append("image", file);
		fmData.append("aaaa", 13332);
		try {
			const res = await axios.post(action, fmData, config);
		 	onSuccess("Ok");
		 	console.log("server res: ", res);
		}
		catch (err) {
			console.log("Eroor: ", err);
			const error = new Error("Some error");
			onError({ err });
		}
		*/
	};

	handleRemove = e => {
		console.log(e, e.standard)
		const {objId, objType} = this.props
		apiRequest('remove_image', {objId, objType, filename: e.standard})
		.then(res => {
			//console.log('this.props.afterUpdate()', this.props.afterUpdate)
			this.props.afterUpdate()
		})
	}

	render() {
		const {previewVisible, previewImage, fileList, previewTitle} = this.state;
		const uploadButton = (
		  <div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		  </div>
		);
		
		return (
		<>
			<Upload
				//action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
				listType="picture-card"
				fileList={this.props.fileList}
				onPreview={this.handlePreview}
				onChange={this.handleChange}
				onRemove = {this.handleRemove}
				customRequest={this.uploadImage}
			>
				{fileList.length >= 8 ? null : uploadButton}
			</Upload>

			<Modal
			  visible={previewVisible}
			  title={previewTitle}
			  footer={null}
			  onCancel={this.handleCancel}
			>
			  <img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</>
		);
	}
}
