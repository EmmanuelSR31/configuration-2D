<template>
<div>
  <div class="config-header">
    <a href="javascript:void(0)" @click="baseModal = true">{{basicSettings.name}} <Icon type="md-arrow-dropdown" /></a>
    <span class="config-header-btn">
      <Button @click="saveConfig">保存</Button>
      <Button @click="viewConfig" style="margin-left: 15px;">预览</Button>
    </span>
  </div>
  <div class="config-con">
    <div class="config-left">
      <ul>
        <li :class="{'active': curItemListType === 'common'}" @click="setCurItemListType('common')"><a href="javascript:void(0)"><Icon type="ios-paper-outline" /><br>基本</a></li>
        <li :class="{'active': curItemListType === 'chart'}" @click="setCurItemListType('chart')"><a href="javascript:void(0)"><Icon type="md-stats" /><br>组件</a></li>
        <li :class="{'active': curItemListType === 'device'}" @click="setCurItemListType('device')"><a href="javascript:void(0)"><Icon type="ios-image-outline" /><br>图库</a></li>
        <li :class="{'active': curItemListType === 'img'}" @click="setCurItemListType('img')"><a href="javascript:void(0)"><Icon type="md-photos" /><br>图形</a></li>
        <li :class="{'active': curItemListType === 'canvas'}" @click="setCurItemListType('canvas')"><a href="javascript:void(0)"><Icon type="md-git-compare" /><br>动画</a></li>
        <li :class="{'active': curItemListType === 'uploadImg'}" @click="setCurItemListType('uploadImg')"><a href="javascript:void(0)"><Icon type="md-cloud-upload" /><br>上传</a></li>
      </ul>
    </div>
    <div class="config-item-con" v-show="itemListShow">
      <div class="config-item-top" v-show="curItemListType === 'device'">
        {{svgItemsTypeTitle}}
        <a href="javascript:void(0)" @click="toggleDeviceItemType">
          <svg class="icon" aria-hidden="true" :style="{transform: 'rotate(' + (deviceItemTypeShow ? 0 : 180) + 'deg)'}">
            <use xlink:href="#iconxiangxiazhanhang"></use>
          </svg>
        </a>
      </div>
      <div class="config-item-list-con" :style="{height: curItemListType === 'device' ? 'calc(100% - 20px)' : '100%'}">
        <ul class="config-common-item-list" v-show="curItemListType === 'common'">
          <li v-for="(item, index) in commonItems" :key="index">
            <drag class="drag" :transfer-data="item">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + item.icon"></use>
              </svg>
              <h3>{{item.name}}</h3>
            </drag>
          </li>
        </ul>
        <ul v-show="curItemListType === 'chart'" class="config-item-list">
          <li v-for="(item, index) in chartItems" :key="index">
            <drag class="drag" :transfer-data="item"><img :alt="item.name" :title="item.name" :src="item.img"></drag>
          </li>
        </ul>
        <div v-show="deviceItemTypeShow && curItemListType === 'device'" class="config-item-type-con">
          <ul>
            <li :class="{'active': svgItemsTypeTitle === '容器'}" @click="setSvgItems('svgContainerItems', '容器')">容器</li>
            <li :class="{'active': svgItemsTypeTitle === '阀门'}" @click="setSvgItems('svgValveItems', '阀门')">阀门</li>
            <li :class="{'active': svgItemsTypeTitle === '水处理'}" @click="setSvgItems('svgWaterItems', '水处理')">水处理</li>
            <li :class="{'active': svgItemsTypeTitle === 'HAVC'}" @click="setSvgItems('svgHavcItems', 'HAVC')">HAVC</li>
            <li :class="{'active': svgItemsTypeTitle === '加热器'}" @click="setSvgItems('svgHeaterItems', '加热器')">加热器</li>
            <li :class="{'active': svgItemsTypeTitle === '物流'}" @click="setSvgItems('svgLogisticsItems', '物流')">物流</li>
            <li :class="{'active': svgItemsTypeTitle === '工业'}" @click="setSvgItems('svgIndustryItems', '工业')">工业</li>
          </ul>
        </div>
        <ul v-show="!deviceItemTypeShow && curItemListType === 'device'" class="config-item-list">
          <li v-for="(item, index) in svgItems" :key="index">
            <drag class="drag" :transfer-data="item"><img :alt="item.name" :title="item.name" :src="item.img"></drag>
          </li>
        </ul>
        <ul v-show="curItemListType === 'img'" class="config-item-list config-img-item-list">
          <li v-for="(item, index) in imgItems" :key="index">
            <drag class="drag" :transfer-data="item"><img :src="item.img"></drag>
          </li>
        </ul>
        <ul v-show="curItemListType === 'canvas'" class="config-item-list">
          <li v-for="(item, index) in canvasItems" :key="index">
            <drag class="drag" :transfer-data="item"><img :alt="item.name" :title="item.name" :src="item.img"></drag>
          </li>
        </ul>
        <div v-show="curItemListType === 'uploadImg'">
          <ul class="config-item-list upload-img-list">
            <li v-for="(item, index) in uploadImgs" :key="index">
              <drag class="drag" :transfer-data="item"><img :src="uploadIp + '/v2/upDown/preview?id=' + item.id"></drag>
              <a @click="delUploadImg(item)" class="upload-img-del"><Icon type="md-close-circle" /></a>
            </li>
          </ul>
          <div style="text-align: center;">
            <Upload multiple :action="uploadIp + '/v2/upDown/imageFile'" :data="{clientId: clientId}" accept="image/*" :format="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']" :show-upload-list="false" :on-success="handleSuccess">
              <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
          </div>
        </div>
      </div>
    </div>
    <div :style="{width: basicSettings.width + 'px', height: basicSettings.height + 'px'}" @mousedown="configClick">
      <vue-draggable-resizable :class="{'back-drag-able' : backDragFlag}" :draggable="backDragFlag" :resizable="false" :w="basicSettings.width" :h="basicSettings.height" :x="backDragX" :y="backDragY" @dragstop="backDragStop">
        <drop class="drop" @drop="handleDrop">
          <div class="config-center" :class="{'config-center-bg': basicSettings.showAuxiliaryLine}" :style="{width: basicSettings.width + 'px', height: basicSettings.height + 'px', backgroundColor: basicSettings.backColor}">
            <VueDragResize v-show="showSelDiv" :isActive="true" :isResizable="false" :w="selDivWidth" :h="selDivHeight" :x="selDivX" :y="selDivY" @dragstop="selDragStop">
              <div class="sel-div">
                <VueDragResize v-for="(item, index) in selItems" :isActive="true" :isDraggable="false" :isResizable="false" :w="item.width" :h="item.height" :x="item.left - selDivX - 2" :y="item.top - selDivY - 2" :minw="1" :minh="1" class="svg-div" :style="itemStyle(item)" :data-id="item.id" :key="index">
                  <template v-if="item.type === 'device'">
                    <img :src="item.img" :id="item.id">
                  </template>
                  <template v-else-if="item.type === 'chart'">
                    <template v-if="item.class === 'switch'">
                      <switch1 :obj="item" :index="index"></switch1>
                    </template>
                    <template v-if="item.class === 'valve'">
                      <valve :obj="item" :color="item.color" :index="index"></valve>
                    </template>
                    <template v-else-if="item.class === 'value'">
                      <sensor-value :obj="item" :index="index"></sensor-value>
                    </template>
                    <template v-else-if="item.class === 'led'">
                      <led :obj="item" :index="index"></led>
                    </template>
                    <template v-else-if="item.class === 'echart-line'">
                      <echart-line :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :smoothFlag="item.smoothFlag" :areaFlag="item.areaFlag" :dataZoom="item.dataZoom" :markLine="item.markLine" :stackFlag="item.stackFlag" :index="index"></echart-line>
                    </template>
                    <template v-else-if="item.class === 'echart-bar'">
                      <echart-bar :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :dataZoom="item.dataZoom" :transverse="item.transverse" :stackFlag="item.stackFlag" :index="index"></echart-bar>
                    </template>
                    <template v-else-if="item.class === 'echart-pie'">
                      <echart-pie :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :annular="item.annular" :index="index"></echart-pie>
                    </template>
                    <template v-else-if="item.class === 'echart-gauge'">
                      <echart-gauge :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :max="item.max" :unit="item.unit" :axisLineWidth="item.axisLineWidth" :showAxisLabel="item.showAxisLabel" :axisLabelDistance="item.axisLabelDistance" :detailFontSize="item.detailFontSize" :index="index"></echart-gauge>
                    </template>
                  </template>
                  <template v-else-if="item.type === 'text'">
                    {{item.text}}
                  </template>
                  <template v-else-if="item.type === 'datetime'">
                    {{nowDatetime}}
                  </template>
                  <template v-else-if="item.type === 'weather'">
                    <div class="drag-weather-con">
                      <template v-if="item.class === 1">
                        <iframe width="200" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=1&site=12"></iframe>
                      </template>
                      <template v-else-if="item.class === 2">
                        <iframe width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=1&icon=1&wind=1&num=1&site=12"></iframe>
                      </template>
                      <template v-else-if="item.class === 3">
                        <iframe width="320" scrolling="no" height="120" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=19&icon=1&temp=1&num=1&site=12"></iframe>
                      </template>
                      <template v-else-if="item.class === 4">
                        <iframe width="640" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=5&site=12"></iframe>
                      </template>
                      <div class="drag-weather-mask"></div>
                    </div>
                  </template>
                  <template v-else-if="item.type === 'link'">
                    <a :href="item.href" target="_blank" :style="{color: item.color}">{{item.text}}</a>
                  </template>
                  <template v-else-if="item.type === 'img'">
                    <div class="svg-img-con">
                      <img :src="item.img" :id="item.id" :style="svgImgStyle(item)">
                    </div>
                  </template>
                  <template v-else-if="item.type === 'pip-h'">
                    <pipeline :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :index="index"></pipeline>
                  </template>
                  <template v-else-if="item.type === 'pip-corner'">
                    <pipeline-corner :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :index="index"></pipeline-corner>
                  </template>
                  <template v-else-if="item.type === 'progress'">
                    <progress-bar :obj="item" :index="index"></progress-bar>
                  </template>
                  <template v-else-if="item.type === 'liquidfill'">
                    <liquidfill :color="item.color" :backColor="item.backColor" :fontSize="item.fontSize" :width="item.width" :height="item.height" :unit="item.unit" :index="index"></liquidfill>
                  </template>
                  <template v-else-if="item.type === 'upload'">
                    <img :src="uploadIp + '/v2/upDown/preview?id=' + item.uploadId" :id="item.id">
                  </template>
                </VueDragResize>
              </div>
            </VueDragResize>
            <VueDragResize v-for="(item, index) in items" v-show="item.showFlag" :isActive="item.active" :isDraggable="!item.lock" :isResizable="!item.lock" :w="item.width" :h="item.height" :x="item.left" :y="item.top" :minw="1" :minh="1" class="svg-div" :style="itemStyle(item)" @activated="onDrag(item, index)" @deactivated="deactivatedItem(index)" @dragstop="dragStop" @resizestop="resizeStop" v-on:contextmenu.native="showContextMenu(item, index, $event)" :data-id="item.id" :key="index">
              <template v-if="item.type === 'device'">
                <img :src="item.img" :id="item.id">
              </template>
              <template v-else-if="item.type === 'chart'">
                <template v-if="item.class === 'switch'">
                  <switch1 :obj="item" :index="index"></switch1>
                </template>
                <template v-if="item.class === 'valve'">
                  <valve :obj="item" :color="item.color" :index="index"></valve>
                </template>
                <template v-else-if="item.class === 'value'">
                  <sensor-value :obj="item" :index="index"></sensor-value>
                </template>
                <template v-else-if="item.class === 'led'">
                  <led :obj="item" :index="index"></led>
                </template>
                <template v-else-if="item.class === 'echart-line'">
                  <echart-line :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :smoothFlag="item.smoothFlag" :areaFlag="item.areaFlag" :dataZoom="item.dataZoom" :markLine="item.markLine" :stackFlag="item.stackFlag" :index="index"></echart-line>
                </template>
                <template v-else-if="item.class === 'echart-bar'">
                  <echart-bar :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :dataZoom="item.dataZoom" :transverse="item.transverse" :stackFlag="item.stackFlag" :index="index"></echart-bar>
                </template>
                <template v-else-if="item.class === 'echart-pie'">
                  <echart-pie :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :annular="item.annular" :index="index"></echart-pie>
                </template>
                <template v-else-if="item.class === 'echart-gauge'">
                  <echart-gauge :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :max="item.max" :unit="item.unit" :axisLineWidth="item.axisLineWidth" :showAxisLabel="item.showAxisLabel" :axisLabelDistance="item.axisLabelDistance" :detailFontSize="item.detailFontSize" :index="index"></echart-gauge>
                </template>
              </template>
              <template v-else-if="item.type === 'text'">
                {{item.text}}
              </template>
              <template v-else-if="item.type === 'datetime'">
                {{nowDatetime}}
              </template>
              <template v-else-if="item.type === 'weather'">
                <div class="drag-weather-con">
                  <template v-if="item.class === 1">
                    <iframe width="200" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=1&site=12"></iframe>
                  </template>
                  <template v-else-if="item.class === 2">
                    <iframe width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=1&icon=1&wind=1&num=1&site=12"></iframe>
                  </template>
                  <template v-else-if="item.class === 3">
                    <iframe width="320" scrolling="no" height="120" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=19&icon=1&temp=1&num=1&site=12"></iframe>
                  </template>
                  <template v-else-if="item.class === 4">
                    <iframe width="640" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=5&site=12"></iframe>
                  </template>
                  <div class="drag-weather-mask"></div>
                </div>
              </template>
              <template v-else-if="item.type === 'link'">
                <a :href="item.href" target="_blank" :style="{color: item.color}">{{item.text}}</a>
              </template>
              <template v-else-if="item.type === 'img'">
                <div class="svg-img-con">
                  <img :src="item.img" :id="item.id" :style="svgImgStyle(item)">
                </div>
              </template>
              <template v-else-if="item.type === 'pip-h'">
                <pipeline :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :index="index"></pipeline>
              </template>
              <template v-else-if="item.type === 'pip-corner'">
                <pipeline-corner :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :index="index"></pipeline-corner>
              </template>
              <template v-else-if="item.type === 'progress'">
                <progress-bar :obj="item" :index="index"></progress-bar>
              </template>
              <template v-else-if="item.type === 'liquidfill'">
                <liquidfill :color="item.color" :backColor="item.backColor" :fontSize="item.fontSize" :width="item.width" :height="item.height" :unit="item.unit" :index="index"></liquidfill>
              </template>
              <template v-else-if="item.type === 'upload'">
                <img :src="uploadIp + '/v2/upDown/preview?id=' + item.uploadId" :id="item.id">
              </template>
            </VueDragResize>
          </div>
        </drop>
      </vue-draggable-resizable>
    </div>
    <div class="contextmenu-con" v-show="contextmenuShow" @mouseleave="contextMenuClose" :style="{left: contextMenu.x + 'px', top: contextMenu.y + 'px'}">
      <ul>
        <li @click="moveUp">上移一层</li>
        <li @click="moveDown">下移一层</li>
        <li @click="moveTop">置于顶层</li>
        <li @click="moveBottom">置于底层</li>
        <li v-show="!contextMenuItem.lock" @click="itemLock">锁定</li>
        <li v-show="contextMenuItem.lock" @click="itemUnlock">解锁</li>
        <li @click="itemCopy">复制</li>
        <li @click="delItem(contextMenuItemIndex)">删除</li>
      </ul>
    </div>
    <div class="config-right" @mousedown.stop :class="{'config-right-hide': !rightShow}">
      <div class="config-right-toggle-btn">
        <a href="javascript:void(0)" :class="{'config-right-hide-btn': !rightShow}" @click="toggleRight">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconxiayibu"></use>
          </svg>
        </a>
      </div>
      <Tabs value="name1">
        <TabPane label="基本设置" name="name1">
          <div class="config-right-from-con">
            <Form v-show="currentItem.type === undefined" :model="basicSettings" label-position="top">
              <FormItem label="拖动画布">
                <i-switch v-model="backDragFlag"></i-switch>
              </FormItem>
              <FormItem label="画布宽">
                <InputNumber :min="1" v-model="basicSettings.width" style="width:100px"></InputNumber>
              </FormItem>
              <FormItem label="画布高">
                <InputNumber :min="1" v-model="basicSettings.height" style="width:100px"></InputNumber>
              </FormItem>
              <FormItem label="显示辅助线">
                <i-switch v-model="basicSettings.showAuxiliaryLine"></i-switch>
              </FormItem>
              <FormItem label="运行页面是否自适应">
                <i-switch v-model="basicSettings.adapt">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
              <FormItem label="背景颜色" style="margin-bottom: 350px;">
                <ColorPicker v-model="basicSettings.backColor" alpha recommend />
              </FormItem>
            </Form>
            <Form v-show="currentItem.type !== undefined" :model="currentItem" label-position="top">
              <FormItem label="">
                <Button type="primary" v-show="!currentItem.lock" @click="currentItem.lock = true">锁定</Button>
                <Button type="primary" v-show="currentItem.lock" @click="currentItem.lock = false">解锁</Button>
              </FormItem>
              <FormItem v-show="['text', 'link'].includes(currentItem.type) || ['value', 'led'].includes(currentItem.class)" label="文本内容">
                <Input v-model="currentItem.text" type="textarea" :rows="3"></Input>
              </FormItem>
              <FormItem v-show="['link'].includes(currentItem.type)" label="链接地址">
                <Input v-model="currentItem.href" type="textarea" :rows="3"></Input>
              </FormItem>
              <FormItem v-show="['text', 'datetime', 'link', 'progress', 'liquidfill'].includes(currentItem.type) || ['value', 'led'].includes(currentItem.class)" :label="['value', 'led'].includes(currentItem.class) ? '数值字体大小' : '字体大小'">
                <Select v-model="currentItem.fontSize" style="width:80px">
                  <Option v-for="(item, index) in fontSizes" :value="item + ''" :key="index">{{item}}</Option>
                </Select>
              </FormItem>
              <FormItem v-show="['value', 'led'].includes(currentItem.class)" label="数值位数">
                <InputNumber :min="1" v-model="currentItem.numDigits"></InputNumber>
              </FormItem>
              <FormItem v-show="['value', 'led'].includes(currentItem.class)" label="字体大小">
                <Select v-model="currentItem.unitFontSize" style="width:80px">
                  <Option v-for="(item, index) in fontSizes" :value="item + ''" :key="index">{{item}}</Option>
                </Select>
              </FormItem>
              <FormItem v-show="['progress'].includes(currentItem.type)">
                <ColorPicker v-model="currentItem.fontColor" alpha recommend />
              </FormItem>
              <FormItem v-show="['img', 'progress', 'liquidfill', 'pip-h', 'pip-corner'].includes(currentItem.type) || ['valve'].includes(currentItem.class)" label="填充颜色">
                <ColorPicker v-model="currentItem.color" alpha recommend />
              </FormItem>
              <FormItem v-show="['valve'].includes(currentItem.class)" label="关闭颜色">
                <ColorPicker v-model="currentItem.errorStatusColor" alpha recommend />
              </FormItem>
              <FormItem v-show="['pip-h', 'pip-corner'].includes(currentItem.type)" label="管道颜色">
                <ColorPicker v-model="currentItem.pipelineColor" alpha recommend />
              </FormItem>
              <FormItem v-show="['pip-h', 'pip-corner'].includes(currentItem.type)" label="管道宽度">
                <InputNumber :min="1" v-model="currentItem.pipelineHeight"></InputNumber>
              </FormItem>
              <FormItem v-show="['pip-corner'].includes(currentItem.type)" label="X轴旋转">
                <i-switch v-model="currentItem.rotateX" />
              </FormItem>
              <div v-show="['text', 'datetime', 'link'].includes(currentItem.type) || ['value', 'led'].includes(currentItem.class)">
                <FormItem label="文本对齐">
                  <Select v-model="currentItem.textAlign" style="width:80px">
                    <Option value="left">左对齐</Option>
                    <Option value="center">居中</Option>
                    <Option value="right">右对齐</Option>
                  </Select>
                </FormItem>
                <FormItem label="文本行高">
                  <Select v-model="currentItem.lineHeight" style="width:80px">
                    <Option value="normal">默认</Option>
                    <Option value="1">1</Option>
                    <Option value="1.2">1.2</Option>
                    <Option value="1.4">1.4</Option>
                    <Option value="1.6">1.6</Option>
                    <Option value="1.8">1.8</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                  </Select>
                </FormItem>
                <FormItem label="字体颜色">
                  <ColorPicker v-model="currentItem.color" alpha recommend />
                </FormItem>
                <FormItem v-show="['value', 'led'].includes(currentItem.class)" label="数值颜色">
                  <ColorPicker v-model="currentItem.numColor" alpha recommend />
                </FormItem>
                <FormItem label="文本样式" class="config-font-style-a-con">
                  <a href="javascript:void(0)" :class="{'active': currentItem.fontWeight === 'bold'}" @click="currentItem.fontWeight = currentItem.fontWeight === 'normal' ? 'bold' : 'normal'">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconzitijiacu"></use>
                    </svg>
                  </a>
                  <a href="javascript:void(0)" :class="{'active': currentItem.fontStyle === 'italic'}" @click="currentItem.fontStyle = currentItem.fontStyle === 'normal' ? 'italic' : 'normal'">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconzitixieti"></use>
                    </svg>
                  </a>
                  <a href="javascript:void(0)" :class="{'active': currentItem.textDecoration === 'underline'}" @click="currentItem.textDecoration = currentItem.textDecoration === 'none' ? 'underline' : 'none'">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconzitixiahuaxian"></use>
                    </svg>
                  </a>
                </FormItem>
              </div>
              <div v-show="['chart'].includes(currentItem.type)">
                <FormItem v-show="['echart-line', 'echart-bar', 'echart-pie', 'echart-gauge'].includes(currentItem.class)" label="白色图表线条文字">
                  <i-switch v-model="currentItem.whiteFlag" />
                </FormItem>
                <FormItem v-show="['echart-line'].includes(currentItem.class)" label="曲线图">
                  <i-switch v-model="currentItem.smoothFlag" />
                </FormItem>
                <FormItem v-show="['echart-line'].includes(currentItem.class)" label="面积图">
                  <i-switch v-model="currentItem.areaFlag" />
                </FormItem>
                <FormItem v-show="['echart-line', 'echart-bar'].includes(currentItem.class)" label="区域缩放">
                  <i-switch v-model="currentItem.dataZoom" />
                </FormItem>
                <FormItem v-show="['echart-line', 'echart-bar'].includes(currentItem.class)" label="堆叠图">
                  <i-switch v-model="currentItem.stackFlag" />
                </FormItem>
                <!-- <FormItem v-show="['echart-line'].includes(currentItem.class)" label="警戒线">
                  <i-switch v-model="currentItem.markLine" />
                </FormItem> -->
                <FormItem v-show="['echart-bar'].includes(currentItem.class)" label="横向柱状图">
                  <i-switch v-model="currentItem.transverse" />
                </FormItem>
                <FormItem v-show="['echart-pie'].includes(currentItem.class)" label="环形饼图">
                  <i-switch v-model="currentItem.annular" />
                </FormItem>
                <div v-show="['echart-gauge'].includes(currentItem.class)">
                  <FormItem label="轴线宽度">
                    <InputNumber :min="0" v-model="currentItem.axisLineWidth"></InputNumber>
                  </FormItem>
                  <FormItem label="是否显示标签">
                    <i-switch v-model="currentItem.showAxisLabel" />
                  </FormItem>
                  <FormItem label="标签与刻度线的距离">
                    <InputNumber :min="0" v-model="currentItem.axisLabelDistance"></InputNumber>
                  </FormItem>
                  <FormItem label="字体大小">
                    <InputNumber :min="10" v-model="currentItem.detailFontSize" :active-change="false"></InputNumber>
                  </FormItem>
                </div>
                <div v-show="['switch'].includes(currentItem.class)">
                  <FormItem label="开关组">
                    <Select v-model="currentItem.selectSwitch" style="width:120px" @on-change="selectSwitch">
                      <Option v-for="(item, index) in switchs" :value="item.name" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="开关(开)">
                    <img :src="currentItem.onImg" height="30">
                  </FormItem>
                  <FormItem label="开关(关)">
                    <img :src="currentItem.offImg" height="30">
                  </FormItem>
                </div>
              </div>
            </Form>
            <Form v-show="currentItem.type !== undefined" :model="currentItem" label-position="top">
              <FormItem label="背景颜色">
                <ColorPicker v-model="currentItem.backColor" alpha recommend />
              </FormItem>
              <FormItem label="边框大小">
                <Slider v-model="currentItem.borderWidth" :max="10" :show-input="true"></Slider>
              </FormItem>
              <FormItem label="边框颜色">
                <ColorPicker v-model="currentItem.borderColor" alpha recommend />
              </FormItem>
              <FormItem label="边框样式">
                <Select v-model="currentItem.borderStyle" style="width:100px">
                  <Option v-for="item in lineType" :value="item.value" :key="item.value">{{ item.text }}</Option>
                </Select>
              </FormItem>
              <FormItem label="边框圆角">
                <InputNumber :min="0" v-model="currentItem.borderRadius"></InputNumber>
              </FormItem>
              <FormItem label="透明度">
                <Slider v-model="currentItem.transparency" :max="10" :show-input="true"></Slider>
              </FormItem>
              <FormItem label="旋转">
                <Slider v-model="currentItem.rotate" :max="360" :show-input="true"></Slider>
              </FormItem>
              <FormItem label="大小">
                宽 <InputNumber :min="1" v-model="currentItem.width" style="width:80px"></InputNumber>
                高 <InputNumber :min="1" v-model="currentItem.height" style="width:80px"></InputNumber>
              </FormItem>
              <FormItem label="位置">
                &nbsp;X&nbsp;<InputNumber :min="1" v-model="currentItem.left" style="width:80px"></InputNumber>
                &nbsp;Y&nbsp;<InputNumber :min="1" v-model="currentItem.top" style="width:80px"></InputNumber>
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane label="高级设置" name="name2">
          <div class="config-right-from-con">
            <Form v-if="['pip-h', 'pip-corner', 'progress', 'liquidfill'].includes(currentItem.type) || ['value', 'led', 'switch', 'echart-line', 'echart-bar', 'echart-pie', 'echart-gauge'].includes(currentItem.class)" :model="currentItem" label-position="top">
              <FormItem label="设备">
                <Select v-model="currentItem.deviceId" @on-change="getSensorLis">
                  <Option v-for="(item, index) in deviceList" :value="item.id" :key="index">{{item.deviceName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="传感器">
                <Select v-model="currentItem.sensorId" :multiple="['pip-h', 'pip-corner'].includes(currentItem.type) || ['echart-line', 'echart-bar', 'echart-pie'].includes(currentItem.class)">
                  <Option v-for="(item, index) in sensorList" :value="item.id" :key="index">{{item.sensorName}}</Option>
                </Select>
              </FormItem>
              <FormItem v-show="['liquidfill'].includes(currentItem.type) || ['value', 'led', 'echart-line', 'echart-bar', 'echart-pie', 'echart-gauge'].includes(currentItem.class)" label="单位">
                <Input v-model="currentItem.unit"></Input>
              </FormItem>
              <FormItem v-show="['progress', 'liquidfill'].includes(currentItem.type) || ['echart-gauge'].includes(currentItem.class)" label="最大值">
                <InputNumber v-model="currentItem.max"></InputNumber>
              </FormItem>
              <FormItem v-show="['value'].includes(currentItem.class)" label="是否显示状态">
                <Select v-model="currentItem.showStatus">
                  <Option value="false">否</Option>
                  <Option value="true">是</Option>
                </Select>
              </FormItem>
              <FormItem v-show="currentItem.showStatus === 'true'" label="正常颜色">
                <ColorPicker v-model="currentItem.normalStatusColor" alpha recommend />
              </FormItem>
              <FormItem v-show="currentItem.showStatus === 'true'" label="异常颜色">
                <ColorPicker v-model="currentItem.errorStatusColor" alpha recommend />
              </FormItem>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
  <Modal v-model="baseModal" width="380" title="基本信息" footer-hide :mask-closable="false">
    <div class="base-modal-con">
      <Form :model="basicSettings" :label-width="80">
        <FormItem label="应用封面" class="config-cover">
          <Upload :action="'http://111.85.150.76:9001/files/upload'" accept="image/*" :format="['jpg', 'jpeg', 'png', 'gif', 'bmp']" :show-upload-list="false" :on-success="handleCoverSuccess">
            <template v-if="basicSettings.cover === '' || basicSettings.cover === null || basicSettings.cover === undefined">
              <img src="/img/config-temp.png">
            </template>
            <template v-else>
              <img :src="basicSettings.cover">
            </template>
          </Upload>
          （支持自定义/大小264*177,500K以内支持jpg,png,bmp,gif ）
        </FormItem>
        <FormItem label="应用名称">
          <Input v-model="basicSettings.name"></Input>
        </FormItem>
        <div class="text-center form-btn-con">
          <button @click="baseModal = false">确定</button>
        </div>
      </Form>
    </div>
  </Modal>
</div>
</template>

<script>
import Util from '@/utils/index'
import { Drag, Drop } from 'vue-drag-drop'
import VueDragResize from 'vue-drag-resize'
import pipeline from '../components/canvas-pipeline.vue'
import pipelineCorner from '../components/canvas-pipeline-corner.vue'
import progressBar from '../components/progress-bar.vue'
import liquidfill from '../components/liquidfill.vue'
import switch1 from '../components/switch1.vue'
import valve from '../components/valve.vue'
import sensorValue from '../components/sensor-value.vue'
import led from '../components/led.vue'
import echartLine from '../components/echart-line.vue'
import echartBar from '../components/echart-bar.vue'
import echartPie from '../components/echart-pie.vue'
import echartGauge from '../components/echart-gauge.vue'
export default {
  name: 'editConfiguration',
  props: {
    dataJson: String,
    method: String
  },
  components: {
    Drag,
    Drop,
    VueDragResize,
    pipeline,
    pipelineCorner,
    progressBar,
    liquidfill,
    switch1,
    valve,
    sensorValue,
    led,
    echartLine,
    echartBar,
    echartPie,
    echartGauge
  },
  data () {
    return {
      commonItems: this.$store.state.commonItems, // 基本
      chartItems: this.$store.state.chartItems, // 组件
      svgItems: this.$store.state.svgContainerItems, // 图库
      imgItems: this.$store.state.imgItems, // 图形
      canvasItems: this.$store.state.canvasItems, // 动画
      switchs: this.$store.state.switchs, // 开关组
      svgItemsTypeTitle: '容器', // 图库类别名
      items: [],
      defalutItem: { // 带默认属性的对象
        borderColor: 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,1)',
        backColor: 'rgba(255,255,255,0)',
        fontColor: 'rgba(255,255,255,1)',
        pipelineColor: 'rgba(206,218,239,1)',
        normalStatusColor: 'rgba(25,201,210,1)',
        errorStatusColor: 'rgba(235,98,51,1)',
        numColor: 'rgba(0,0,0,1)'
      },
      currentItem: { borderColor: 'rgba(0,0,0,0)', color: 'rgba(0,0,0,1)', backColor: 'rgba(255,255,255,0)', fontColor: 'rgba(255,255,255,1)', pipelineColor: 'rgba(206,218,239,1)', normalStatusColor: 'rgba(25,201,210,1)', errorStatusColor: 'rgba(235,98,51,1)', numColor: 'rgba(0,0,0,1)' }, // 当前拖拽对象
      contextMenuItem: {}, // 打开右键菜单的对象
      currentItemIndex: 0, // 当前拖拽对象位置
      contextMenuItemIndex: 0, // 打开右键菜单的对象对象位置
      contextMenu: { // 右键菜单
        x: 0,
        y: 0
      },
      contextmenuShow: false, // 是否显示右键菜单
      rightShow: true, // 右侧配置是否显示
      basicSettings: { // 基本设置
        name: '',
        cover: '',
        width: 0,
        height: 0,
        adapt: false,
        showAuxiliaryLine: true,
        backColor: 'rgba(255,255,255,0)'
      },
      lineType: this.$store.state.lineType, // 线条样式
      deviceItemTypeShow: false, // 图库分类是否显示
      curItemListType: 'common', // 当前显示图片列表类型
      itemListShow: true, // 图片列表是否显示
      nowDatetime: '', // 当前时间
      deviceList: [], // 设备列表
      sensorList: [], // 传感器列表
      deviceSensors: {}, // 设备所含传感器
      uploadImgs: [], // 上传图片列表
      uploadIp: this.$store.state.uploadIp, // 上传ip地址
      baseModal: false, // 基本信息对话框是否显示
      user: { actual_name: '' },
      id: '',
      role: '', // 角色
      customFlag: true,
      clientId: '',
      clientNanme: '',
      showSelDiv: false, // 是否显示框选线
      selDivX: 0, // 框选线left
      selDivY: 0, // 框选线top
      selDivWidth: 0, // 框选线宽
      selDivHeight: 0, // 框选线高
      startX: 0, // 框选线开始点left
      startY: 0, // 框选线开始点top
      selTimer: null, // 框选线移动定时器
      selTimerFlag: false, // 是否计算框选线移动位置
      selItems: [], // 选中的块
      fontSizes: [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 60, 72, 82, 96, 120, 200], // 字体大小
      direction: { left: false, right: false, top: false, bottom: false }, // 按键方向
      backDragFlag: false, // 是否拖动画布
      backDragX: 60, // 画布left
      backDragY: 0 // 画布top
    }
  },
  methods: {
    /**
    * @desc 初始化
    */
    init: function (flag, id) {
      let temp = JSON.parse(this.dataJson)
      this.items = []
      if (flag === 'add') {
        this.basicSettings.name = temp.name
        this.basicSettings.cover = temp.cover
        this.basicSettings.width = document.body.clientWidth - 60
        this.basicSettings.height = document.body.clientHeight - 50
      } else if (flag === 'edit') {
        this.id = id
        this.$api.put('/v2/apps/graphics/obtainDeviceGraphicsData', { id: id }, r => {
          console.log(r.data.data)
          if (r.data.status) {
            let temp = JSON.parse(r.data.data.graphicsJson)
            this.basicSettings = temp.basicSettings
            this.items = temp.items
            for (const iterator of this.items) {
              if (!Util.isEmpty(iterator.deviceId)) {
                this.getSensorLisByDeviceId(iterator.deviceId)
              }
            }
          }
          console.log(this.basicSettings)
        })
      }
    },
    /**
    * @desc 拖拽完成
    * @param {Object} item 拖拽对象
    */
    handleDrop: function (item, evt) {
      // console.log(item)
      // console.log(evt)
      let temp = JSON.parse(JSON.stringify(item))
      if (temp.picturePath !== undefined) {
        temp.uploadId = temp.id
        temp.type = 'upload'
        temp.height = temp.high
      }
      temp.id = this.items.length
      temp.left = evt.offsetX
      temp.top = evt.offsetY
      temp.borderWidth = 0
      temp.borderColor = 'rgba(0,0,0,0)'
      temp.borderRadius = 0
      temp.transparency = 10
      temp.rotate = 0
      temp.active = true
      temp.lock = false
      temp.showFlag = true
      // console.log(temp)
      this.items.push(temp)
      this.currentItem = temp
      this.currentItemIndex = this.items.length - 1
    },
    /**
    * @desc 开始移动
    * @param {Object} item 移动对象
    * @param {Num} index 位置
    */
    onDrag: function (item, index) {
      if (!this.showSelDiv) {
        for (let temp of this.items) {
          temp.active = false
        }
        this.currentItem = this.defalutItem
        this.$nextTick(function () {
          this.currentItem = item
          this.currentItem.active = true
          this.currentItemIndex = index
          this.getSensorLis()
        })
      }
    },
    /**
    * @desc 取消选择
    * @param {Num} index 位置
    */
    deactivatedItem: function (index) {
      this.items[index].active = false
      this.currentItem = this.defalutItem
    },
    /**
    * @desc 移动结束
    * @param {Object} e 移动数据
    */
    dragStop: function (e) {
      this.currentItem.left = e.left
      this.currentItem.top = e.top
    },
    /**
    * @desc 改变大小结束
    * @param {Object} e 移动数据
    */
    resizeStop: function (e) {
      this.currentItem.left = e.left
      this.currentItem.top = e.top
      this.currentItem.width = e.width
      this.currentItem.height = e.height
    },
    /**
    * @desc 画布移动结束
    * @param {Number} left 移动数据left
    * @param {Number} top 移动数据top
    */
    backDragStop: function (left, top) {
      this.backDragX = left
      this.backDragY = top
    },
    /**
    * @desc 点击编辑区，开始框选
    * @param {Object} e 点击数据
    */
    configClick: function (e) {
      // console.log(e)
      // 如果线显示，清空线数据
      if (this.showSelDiv) {
        for (const iterator of this.selItems) {
          iterator.showFlag = true
        }
        this.selItems = []
        this.showSelDiv = false
        this.selDivX = 0
        this.selDivY = 0
        this.selDivWidth = 0
        this.selDivHeight = 0
        this.translateX = 0
        this.translateY = 0
      }
      const that = this
      if (Util.isEmpty(this.currentItem.type) && !this.backDragFlag) {
        this.startX = e.offsetX
        this.startY = e.offsetY
        this.selDivX = this.startX
        this.selDivY = this.startY
        this.showSelDiv = true
        this.selTimer = setInterval(function () {
          that.selTimerFlag = true
        }, 50)
        // 鼠标移动改变线宽高
        document.onmousemove = function (evt) {
          // console.log(evt)
          if (that.selTimerFlag) {
            let tempX = Math.abs(evt.offsetX)
            let tempY = Math.abs(evt.offsetY)
            let x = Math.min(that.startX, evt.offsetX)
            let y = Math.min(that.startY, tempY)
            that.selDivWidth = Math.abs(tempX - that.startX)
            that.selDivHeight = Math.abs(tempY - that.startY)
            that.selDivX = x
            that.selDivY = y
            that.selTimerFlag = false
          }
        }
        // 鼠标放开清除事件
        document.onmouseup = function () {
          if (that.selDivWidth > 5) {
            that.selFinished = true
            that.setSelItems()
          } else {
            that.showSelDiv = false
          }
          that.selTimerFlag = false
          window.clearInterval(that.selTimer)
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    },
    // 设置选中的块
    setSelItems: function () {
      for (const iterator of this.items) {
        iterator.active = false
        let sl = iterator.width + iterator.left
        let st = iterator.height + iterator.top
        if (sl > this.selDivX && st > this.selDivY && iterator.left < this.selDivX + this.selDivWidth && iterator.top < this.selDivY + this.selDivHeight) {
          this.selItems.push(iterator)
          // iterator.active = true
          iterator.showFlag = false
        }
      }
    },
    /**
    * @desc 框选线移动结束
    * @param {Object} e 移动数据
    */
    selDragStop: function (e) {
      for (const iterator of this.selItems) {
        iterator.left = iterator.left + (e.left - this.selDivX)
        iterator.top = iterator.top + (e.top - this.selDivY)
      }
      this.selDivX = e.left
      this.selDivY = e.top
    },
    /**
    * @desc 打开右键菜单
    * @param {Object} item 要打开右键菜单的对象
    * @param {Number} index 对象位置
    * @param {Object} event 事件
    */
    showContextMenu: function (item, index, event) {
      event.preventDefault()
      this.contextMenuItem = item
      this.contextMenuItemIndex = index
      this.contextMenu.x = event.clientX - 5
      this.contextMenu.y = event.clientY - 5
      this.contextmenuShow = true
    },
    /**
    * @desc 关闭右键菜单
    */
    contextMenuClose: function () {
      this.contextmenuShow = false
    },
    /**
    * @desc 对象上移一层
    */
    moveUp: function () {
      if (this.contextMenuItemIndex < this.items.length - 1) {
        [this.items[this.contextMenuItemIndex], this.items[this.contextMenuItemIndex + 1]] = [this.items[this.contextMenuItemIndex + 1], this.items[this.contextMenuItemIndex]]
      }
      this.contextmenuShow = false
    },
    /**
    * @desc 对象下移一层
    */
    moveDown: function () {
      if (this.contextMenuItemIndex > 0) {
        [this.items[this.contextMenuItemIndex], this.items[this.contextMenuItemIndex - 1]] = [this.items[this.contextMenuItemIndex - 1], this.items[this.contextMenuItemIndex]]
      }
      this.contextmenuShow = false
    },
    /**
    * @desc 对象置于顶层
    */
    moveTop: function () {
      this.items.splice(this.contextMenuItemIndex, 1)
      this.items.push(JSON.parse(JSON.stringify(this.contextMenuItem)))
      this.contextmenuShow = false
    },
    /**
    * @desc 对象置于底层
    */
    moveBottom: function () {
      this.items.splice(this.contextMenuItemIndex, 1)
      this.items.unshift(JSON.parse(JSON.stringify(this.contextMenuItem)))
      this.contextmenuShow = false
    },
    /**
    * @desc 对象锁定
    */
    itemLock: function () {
      this.items[this.contextMenuItemIndex].lock = true
      this.contextmenuShow = false
    },
    /**
    * @desc 对象解锁
    */
    itemUnlock: function () {
      this.items[this.contextMenuItemIndex].lock = false
      this.contextmenuShow = false
    },
    /**
    * @desc 对象复制
    */
    itemCopy: function () {
      let temp = JSON.parse(JSON.stringify(this.contextMenuItem))
      temp.id = this.items.length
      temp.left = temp.left - 20
      temp.top = temp.top - 20
      this.items.push(temp)
      this.contextmenuShow = false
    },
    /**
    * @desc 删除对象
    * @param {Number} index 对象位置
    */
    delItem: function (index) {
      this.items.splice(index, 1)
      this.contextmenuShow = false
      this.currentItem = {}
    },
    /**
    * @desc 切换显示右侧设置
    */
    toggleRight: function () {
      this.rightShow = !this.rightShow
    },
    /**
    * @desc 生成样式
    * @param {Object} item 要生成样式的对象
    */
    itemStyle: function (item) {
      let temp = {
        backgroundColor: item.backColor,
        borderWidth: item.borderWidth + 'px',
        borderStyle: item.borderStyle,
        borderColor: item.borderColor,
        borderRadius: item.borderRadius + 'px',
        opacity: item.transparency / 10,
        transform: `rotate(${item.rotate}deg)`
      }
      if (['text', 'datetime', 'link'].includes(item.type)) {
        temp.fontSize = item.fontSize + 'px'
        temp.fontWeight = item.fontWeight
        temp.fontStyle = item.fontStyle
        temp.textDecoration = item.textDecoration
        temp.color = item.color
        temp.textAlign = item.textAlign
        temp.lineHeight = item.lineHeight
      }
      if (['progress', 'liquidfill'].includes(item.type)) {
        delete temp.backgroundColor
      }
      if (['pip-corner'].includes(item.type)) {
        temp.transform = item.rotateX ? `rotateX(180deg) rotate(${item.rotate}deg)` : `rotateX(0deg) rotate(${item.rotate}deg)`
      }
      return temp
    },
    /**
    * @desc 生成svg图片样式
    * @param {Object} item 要生成样式的对象
    */
    svgImgStyle: function (item) {
      let temp = {
        width: `${item.width}px`,
        height: `${item.height}px`,
        filter: `drop-shadow(${item.color} ${item.width}px 0)`,
        position: 'relative',
        left: `-${item.width}px`
      }
      return temp
    },
    /**
    * @desc 设置当前左侧显示类型
    * @param {String} val 显示类型
    */
    setCurItemListType: function (val) {
      if (this.curItemListType === val) {
        this.itemListShow = !this.itemListShow
      } else {
        this.curItemListType = val
        this.itemListShow = true
      }
    },
    /**
    * @desc 切换显示图库分类
    */
    toggleDeviceItemType: function () {
      this.deviceItemTypeShow = !this.deviceItemTypeShow
    },
    /**
    * @desc 更新当前时间
    */
    setNowDatetime: function () {
      let date = new Date()
      this.nowDatetime = date.toLocaleString('zh', { hour12: false })
    },
    /**
    * @desc 设置svg图库列表
    * @param {String} name 图库列表名
    * @param {String} title 图库名
    */
    setSvgItems: function (name, title) {
      this.svgItems = this.$store.state[name]
      this.svgItemsTypeTitle = title
      this.deviceItemTypeShow = false
    },
    /**
    * @desc 上传成功
    * @param {Object} res 返回数据
    */
    handleSuccess: function (res) {
      // console.log(res)
      if (res.success) {
        this.$Message.success(res.msg)
        this.getUploadImgs()
      }
    },
    /**
    * @desc 删除上传图片
    * @param {Object} item 图片
    */
    delUploadImg: function (item) {
      this.$api.delete('/v2/picture/delete?id=' + item.id, {}, r => {
        if (r.data) {
          this.getUploadImgs()
        }
      })
    },
    /**
    * @desc 上传成功
    * @param {Array} res 返回数据
    */
    handleCoverSuccess: function (res) {
      this.$set(this.basicSettings, 'cover', res.data)
    },
    /**
    * @desc 获取客户下面的设备
    * @param {Number} clientId 客户id
    */
    getCdevice: function (clientId) {
      this.$api.get('/v2/device/xia?clientId=' + clientId, {}, r => {
        this.deviceList = r.data
      })
    },
    /**
    * @desc 获取设备下面的传感器
    */
    getSensorLis: async function () {
      this.sensorList = []
      if (!Util.isEmpty(this.currentItem.deviceId)) {
        if (this.deviceSensors[this.currentItem.deviceId] === undefined) {
          this.sensorList = await this.getSensorLisByDeviceId(this.currentItem.deviceId)
        } else {
          this.sensorList = this.deviceSensors[this.currentItem.deviceId]
        }
      }
    },
    /**
    * @desc 根据设备id取传感器
    * @param {String} id 设备id
    */
    getSensorLisByDeviceId: async function (id) {
      return new Promise((resolve) => {
        this.$api.get('/v2/sensor/list?deviceId=' + id, {}, r => {
          this.deviceSensors[id] = r.data
          resolve(r.data)
        })
      })
    },
    /**
    * @desc 获取上传图片
    */
    getUploadImgs () {
      this.$api.get('/v2/picture/list?clientId=' + this.clientId, {}, r => {
        this.uploadImgs = r.data
      })
    },
    /**
    * @desc 选择开关组
    */
    selectSwitch: function () {
      let temp = this.switchs.find(ele => ele.name === this.currentItem.selectSwitch)
      this.currentItem.onImg = temp.onImg
      this.currentItem.offImg = temp.offImg
    },
    /**
    * @desc 保存
    */
    saveConfig: function () {
      this.$Spin.show()
      let obj = { basicSettings: this.basicSettings, items: this.items }
      let jsonStr = JSON.stringify(obj)
      console.log(jsonStr)
      if (this.method === 'add') {
        let temp = Util.getCurrentDate()
        temp = temp.replace(/-/g, '/')
        this.$api.post('/v2/apps/graphics/insert', { title: this.basicSettings.name, coverChart: this.basicSettings.cover, graphicsJson: jsonStr, publishingLogo: 0, addDate: temp, addPople: this.user.actual_name }, r => {
          if (r.data.status) {
            this.$Message.success('新增成功')
            this.$emit('save-success')
          } else {
            this.$swal('新增失败', '', 'error')
          }
          this.$Spin.hide()
        })
      } else if (this.method === 'edit') {
        this.$api.post('/v2/apps/graphics/updateGraphics', { id: this.id, title: this.basicSettings.name, coverChart: this.basicSettings.cover, graphicsJson: jsonStr }, r => {
          if (r.data.status) {
            this.$Message.success('修改成功')
            this.$emit('save-success')
          } else {
            this.$swal('修改失败', '', 'error')
          }
          this.$Spin.hide()
        })
      }
    },
    /**
    * @desc 预览
    */
    viewConfig: function () {
      let obj = { basicSettings: this.basicSettings, items: this.items }
      localStorage.configJson = JSON.stringify(obj)
      let routeUrl = this.$router.resolve({
        path: 'viewConfig'
      })
      window.open(routeUrl.href)
    }
  },
  mounted () {
    if (!Util.isEmpty(sessionStorage.user)) {
      this.user = JSON.parse(sessionStorage.user)
    }
    this.$api.post('/v2/apps/customer/selectCustomer', {}, r => {
      this.customList = r.data.object
      this.role = JSON.parse(sessionStorage.user).sOid
      if (this.role === 14) {
        this.customFlag = true
        this.clientId = ''
      } else {
        var cId = JSON.parse(sessionStorage.user).cId
        this.clientId = String(cId)
        let temp8 = this.customList.find(ele => ele.id === cId)
        this.clientNanme = temp8.customerName
        this.customFlag = false
      }
      this.getCdevice(this.clientId)
      this.getUploadImgs()
    })
    this.getCdevice(this.clientId)
    this.getUploadImgs()
    const that = this
    // 时间实时更新
    window.setInterval(that.setNowDatetime, 1000)
    // 绑定键盘事件,删除键和方向键
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (!Util.isEmpty(that.currentItem.type)) {
        if (key === 46) {
          that.delItem(that.currentItemIndex)
        } else if (key === 37) {
          that.direction.left = true
          return false
        } else if (key === 38) {
          that.direction.top = true
          return false
        } else if (key === 39) {
          that.direction.right = true
          return false
        } else if (key === 40) {
          that.direction.bottom = true
          return false
        }
      }
    }
    document.onkeyup = function (e) {
      let key = window.event.keyCode
      if (key === 37) {
        that.direction.left = false
      } else if (key === 38) {
        that.direction.top = false
      } else if (key === 39) {
        that.direction.right = false
      } else if (key === 40) {
        that.direction.bottom = false
      }
    }
    setInterval(function () {
      if (that.direction.left) {
        that.currentItem.left -= 1
      } else if (that.direction.top) {
        that.currentItem.top -= 1
      } else if (that.direction.right) {
        that.currentItem.left += 1
      } else if (that.direction.bottom) {
        that.currentItem.top += 1
      }
    }, 50)
  }
}
</script>

<style lang="scss">
@import "../../style/configuration";
</style>
