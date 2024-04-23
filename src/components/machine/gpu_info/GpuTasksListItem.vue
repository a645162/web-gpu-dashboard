<script lang="ts">

import {computed, defineComponent, inject, PropType, Ref} from "vue";

import {convertFromMBToGB, getMemoryString} from "../../../ts/type/MemorySize.ts";
import RuntimeComponent from "./RuntimeComponent.vue";
import {ElCard, ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {GpuTaskInfoItemType} from "../../../ts/api/GpuTaskInfoItemType.ts";
import {getTimeStrFromTimestamp} from "../../../ts/type/DateTimeUtils.ts";
import {useStoreSettings} from "../../../stores/storeSettings.ts";
import {copyToClipboard} from "../../../ts/utils/Clipboard.ts";

export default defineComponent({
  name: 'GpuTasksListItem',
  components: {
    RuntimeComponent,
    ElCard
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    gpu_task_info: {
      type: Object as PropType<GpuTaskInfoItemType>,
      required: true,
    },
  },
  methods: {
    getMemoryString,
    convertFromMBToGB,

    onContextMenu(e: MouseEvent) {
      //prevent the browser's default menu
      e.preventDefault();

      const copyProjectName = () => {
        const projectName = this.item.mainName;

        copyToClipboard(projectName)
            .then(() => {
              ElNotification(
                  {
                    title: "复制",
                    message: `已复制项目名称: "${projectName}".`,
                    type: 'success',
                  }
              );
            })
            .catch(err => {
              ElNotification(
                  {
                    title: "复制失败",
                    message: `复制项目名称失败: "${projectName}".\n失败原因:${err}`,
                    type: 'error',
                  }
              );
            });

      };

      const setFilterProject = () => {
        this.projectFilterSettingBox(this.item.mainName);
      };

      const cancelAllFilter = this.cancelAllFilter;

      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "复制工程名称",
            onClick: () => {
              copyProjectName();
            }
          },
          {
            label: "过滤器",
            children: [
              {
                label: "设置过滤器(工程名称)",
                onClick() {
                  setFilterProject();
                },
              },
              {
                label: "取消所有过滤器",
                onClick() {
                  cancelAllFilter();
                },
              },
            ]
          },
        ],
        theme: this.contextMenuTheme.toString(),
      });

    },

  },
  setup(props) {
    const storeSettings = useStoreSettings();

    const nightMode = inject('nightMode') as Ref<boolean>;

    const contextMenuTheme = computed(() => {
      return !nightMode.value ? 'flat' : 'flat dark';
    });

    const indexTextAlphaValue = 0.15
    const textColor = computed(() => {
      return (
          nightMode.value ?
              `rgba(255, 255, 255, ${indexTextAlphaValue})`
              :
              `rgba(0, 0, 0, ${indexTextAlphaValue})`
      );
    });

    const startTimeString = (startTime: number) => {
      const timeString = getTimeStrFromTimestamp(startTime);

      return `启动时间:${timeString}`;
    };

    const testFilterUserNameForTaskItem = (userName: string) => {
      if (userName === "") {
        return false;
      }
      if (storeSettings.filterUserName.trim() === "") {
        return true;
      }
      return userName.trim() === storeSettings.filterUserName.trim();
    }

    const filterNameConfirmEvent = (userName: string) => {
      if (userName === "") {
        ElMessage.error('用户名为空，无法过滤!')
        return;
      }
      storeSettings.filterUserName = userName;
      ElNotification(
          {
            title: "过滤器",
            message: `已将过滤器(用户名)设定为: "${userName}".`,
            type: 'success',
          }
      )
    }
    const filterNameCancelEvent = () => {
      storeSettings.filterUserName = "";
      ElNotification(
          {
            title: "过滤器",
            message: "取消设定(用户名)过滤器!",
            type: 'info',
          }
      )
    }

    const testFilterProjectNameForTaskItem = (projectName: string) => {
      if (projectName === "") {
        return false;
      }
      if (storeSettings.filterProjectName === "") {
        return true;
      }
      return projectName.includes(storeSettings.filterProjectName);
    }

    const filterProjectNameConfirmEvent = (projectName: string) => {
      if (projectName === "") {
        ElMessage.error('工程名称为空，无法过滤!')
        return;
      }
      storeSettings.filterProjectName = projectName;
      ElNotification(
          {
            title: "过滤器",
            message: `已将过滤器(工程名称)关键词(Keywords)设定为: "${projectName}".`,
            type: 'success',
          }
      )
    }
    const filterProjectNameCancelEvent = () => {
      storeSettings.filterProjectName = "";
      ElNotification(
          {
            title: "过滤器",
            message: "取消设定(工程名称)过滤器!",
            type: 'info',
          }
      )
    }

    const projectFilterSettingBox = (projectName: string) => {
      let currentProjectNameKeywords = storeSettings.filterProjectName;
      if (currentProjectNameKeywords === "") {
        currentProjectNameKeywords = projectName;
      }
      ElMessageBox.prompt(
          '请设定过滤器(工程名称)的关键词:', '过滤器-工程名称', {
            confirmButtonText: '启动过滤',
            cancelButtonText: '关闭工程过滤器',
            inputValue: currentProjectNameKeywords,
          }
      )
          .then(({value}) => {
            filterProjectNameConfirmEvent(value)
          })
          .catch(() => {
            filterProjectNameCancelEvent()
          })
    }

    const cancelAllFilter = () => {
      storeSettings.filterUserName = "";
      storeSettings.filterProjectName = "";
      ElNotification(
          {
            title: "过滤器",
            message: "取消所有过滤器条件!",
            type: 'info',
          }
      )
    };

    // 系统内存
    const systemMainMemoryString = (item: GpuTaskInfoItemType) => {
      const mainMemMB = item.taskMainMemoryMB;
      if (mainMemMB === undefined) {
        return "";
      }
      if (mainMemMB === 0) {
        return "";
      }
      if (mainMemMB < 1024) {
        return `${mainMemMB}MB`;
      }
      return `${convertFromMBToGB(mainMemMB)}GB`;
    };

    return {
      item: props.gpu_task_info,

      textColor,

      startTimeString,
      systemMainMemoryString,

      // Right Click Menu
      contextMenuTheme,

      // Filter-UserName
      testFilterUserNameForTaskItem,
      filterNameConfirmEvent,
      filterNameCancelEvent,

      // Filter-ProjectName
      projectFilterSettingBox,
      testFilterProjectNameForTaskItem,

      cancelAllFilter,
    }
  },
});

</script>

<template>

  <el-card
      class="item-card"
      v-show="testFilterUserNameForTaskItem(item.name) && testFilterProjectNameForTaskItem(item.mainName)"
      @contextmenu.prevent="onContextMenu"
  >

    <div
        class="overlay-task-index"
        :style="{color : textColor}"
    >
      {{ index + 1 }}
    </div>

    <div class="card-div-parent">

      <div class="card-div-child-left">

        <!--左上-->
        <div class="card-div-child">

          <div>
            <el-badge
                class="info-user-name-badge"
                :value="item.debugMode ? '调试' : ''"
                type="warning"
            >
              <el-popconfirm
                  :title="`是否需要根据姓名(${item.name})进行过滤？`"
                  confirm-button-text="启动"
                  cancel-button-text="关闭姓名过滤器"
                  @confirm="filterNameConfirmEvent(item.name)"
                  @cancel="filterNameCancelEvent"
              >
                <template #reference>
                  <div
                      class="button-name"
                  >
                    {{ item.name }}
                  </div>
                </template>
              </el-popconfirm>
            </el-badge>
          </div>

        </div>

        <!--左下-->
        <div
            class="card-div-child"
            style="min-width: 80px;"
        >
          {{
            getMemoryString(
                convertFromMBToGB(
                    item.gpuMemoryUsage
                )
            )
          }}GiB
        </div>

      </div>

      <el-divider direction="vertical"/>

      <div class="card-div-child-right">

        <!--右上-->
        <div class="card-div-child">

          <div class="info-project-name">
            <el-badge
                class="info-project-name-badge"
                :value="item.worldSize > 1 ? `${item.worldSize}卡` : ''"
                style="padding-left: 5px;padding-right: 5px;"
                type="warning"
                @click="projectFilterSettingBox(item.mainName)"
            >
              <el-tooltip
                  placement="top"
              >
                <template #content>

                  <div v-show="item.screenSessionName">
                    Screen会话名称:{{ item.screenSessionName }}
                  </div>

                  <div v-show="item.projectName">
                    项目名称:{{ item.projectName }}
                  </div>

                  <div v-show="item.pyFileName">
                    Python文件名:{{ item.pyFileName }}
                  </div>

                  <div v-show="item.condaEnv">
                    Conda环境:{{ item.condaEnv }}
                  </div>

                  <el-divider style="padding: 0;margin: 0;"/>

                  <div v-show="systemMainMemoryString(item) !== ''">
                    系统主存:{{ systemMainMemoryString(item) }}
                  </div>

                  <el-divider style="padding: 0;margin: 0;"/>

                  GPU显存使用:{{ getMemoryString(convertFromMBToGB(item.gpuMemoryUsage)) }}GiB

                  <div v-if="item.worldSize > 1">
                    GPU使用数量:{{ item.worldSize }}
                    <br/>
                    当前任务索引:{{ item.localRank }}
                  </div>

                  <el-divider style="padding: 0;margin: 0;"/>

                  <div v-show="item.command">
                    命令行:{{ item.command }}
                  </div>

                </template>

                {{ item.mainName }}

              </el-tooltip>
            </el-badge>
          </div>
          <!--                  </el-popconfirm>-->

        </div>

        <!--右下-->
        <div class="card-div-child">
          <!--1天11时11分-->
          <el-tooltip
              placement="bottom"
              :content="startTimeString(item.startTimestamp)"
          >
            <RuntimeComponent :start-time="item.startTimestamp"/>
          </el-tooltip>
        </div>

      </div>

    </div>

  </el-card>

</template>

<style scoped>

.item-card {
  flex-grow: 1;
  margin-bottom: 10px;
  position: relative;
}

.overlay-task-index {
  position: absolute;
  top: 0;
  left: 4px;
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.15);
  font-size: 64px;
  font-style: italic;
  display: flex;
  justify-content: left;
  align-items: center;
  user-select: none;
  pointer-events: none;
}

.card-div-parent {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
}

.card-div-child-right {
  flex: 1;
}

.card-div-child {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.info-user-name-badge {
  width: 100%;
}

.button-name {
  width: 100%;
  height: 100%;
}

.info-project-name {
  width: 100%;
}

</style>
