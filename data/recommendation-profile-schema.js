// Mirror of existing form options; checked against index.html by tools/check-recommendations.cjs.
window.RECOMMENDATION_PROFILE_SCHEMA = {
  "stage": {
    "label": "你目前的状态",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "stage-0",
        "label": "在校学习"
      },
      {
        "value": "stage-1",
        "label": "在职工作"
      },
      {
        "value": "stage-2",
        "label": "正在求职／待业"
      },
      {
        "value": "stage-3",
        "label": "自由职业／灵活就业"
      },
      {
        "value": "stage-4",
        "label": "准备重返职场"
      },
      {
        "value": "stage-5",
        "label": "暂不求职，先探索"
      },
      {
        "value": "stage-6",
        "label": "其他"
      }
    ]
  },
  "age": {
    "label": "年龄段",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择（可跳过）"
      },
      {
        "value": "age-0",
        "label": "未满18岁"
      },
      {
        "value": "age-1",
        "label": "18–24岁"
      },
      {
        "value": "age-2",
        "label": "25–34岁"
      },
      {
        "value": "age-3",
        "label": "35–44岁"
      },
      {
        "value": "age-4",
        "label": "45–54岁"
      },
      {
        "value": "age-5",
        "label": "55岁及以上"
      },
      {
        "value": "age-6",
        "label": "不愿透露"
      }
    ]
  },
  "education": {
    "label": "最高学习阶段（含当前在读）",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "education-0",
        "label": "初中及以下"
      },
      {
        "value": "education-1",
        "label": "普通高中"
      },
      {
        "value": "education-2",
        "label": "中专／中职／技校"
      },
      {
        "value": "education-3",
        "label": "高职／大专"
      },
      {
        "value": "education-4",
        "label": "本科"
      },
      {
        "value": "education-5",
        "label": "硕士研究生"
      },
      {
        "value": "education-6",
        "label": "博士研究生"
      },
      {
        "value": "education-7",
        "label": "其他"
      },
      {
        "value": "education-8",
        "label": "不愿透露"
      }
    ]
  },
  "educationStatus": {
    "label": "上述学习阶段的状态",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "educationStatus-0",
        "label": "在读"
      },
      {
        "value": "educationStatus-1",
        "label": "已毕业／已取得相应学历"
      },
      {
        "value": "educationStatus-2",
        "label": "未完成／肄业／暂停"
      },
      {
        "value": "educationStatus-3",
        "label": "其他／不适用"
      },
      {
        "value": "educationStatus-4",
        "label": "不愿透露"
      }
    ]
  },
  "workYears": {
    "label": "累计工作经历（不含实习）",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "workYears-0",
        "label": "尚无工作经历"
      },
      {
        "value": "workYears-1",
        "label": "不足1年"
      },
      {
        "value": "workYears-2",
        "label": "1–3年（不满4年）"
      },
      {
        "value": "workYears-3",
        "label": "4–7年（不满8年）"
      },
      {
        "value": "workYears-4",
        "label": "8–15年（不满16年）"
      },
      {
        "value": "workYears-5",
        "label": "16年及以上"
      },
      {
        "value": "workYears-6",
        "label": "不便说明"
      }
    ]
  },
  "internship": {
    "label": "实习经历",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择（可跳过）"
      },
      {
        "value": "internship-0",
        "label": "没有实习经历"
      },
      {
        "value": "internship-1",
        "label": "正在实习"
      },
      {
        "value": "internship-2",
        "label": "曾有实习经历"
      },
      {
        "value": "internship-3",
        "label": "不适用／不便说明"
      }
    ]
  },
  "industry": {
    "label": "当前或最近接触的主要行业",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "industry-0",
        "label": "尚未进入任何行业"
      },
      {
        "value": "industry-1",
        "label": "农林牧渔"
      },
      {
        "value": "industry-2",
        "label": "制造业"
      },
      {
        "value": "industry-3",
        "label": "建筑与房地产"
      },
      {
        "value": "industry-4",
        "label": "批发零售与电商"
      },
      {
        "value": "industry-5",
        "label": "交通运输、仓储与物流"
      },
      {
        "value": "industry-6",
        "label": "住宿、餐饮与生活服务"
      },
      {
        "value": "industry-7",
        "label": "信息技术与互联网"
      },
      {
        "value": "industry-8",
        "label": "金融与保险"
      },
      {
        "value": "industry-9",
        "label": "教育与培训"
      },
      {
        "value": "industry-10",
        "label": "医疗健康与社会服务"
      },
      {
        "value": "industry-11",
        "label": "文化、传媒与娱乐"
      },
      {
        "value": "industry-12",
        "label": "科研与专业服务"
      },
      {
        "value": "industry-13",
        "label": "公共管理与社会组织"
      },
      {
        "value": "industry-14",
        "label": "能源与环境服务"
      },
      {
        "value": "industry-15",
        "label": "其他／跨多个行业"
      },
      {
        "value": "industry-16",
        "label": "不确定／不便说明"
      }
    ]
  },
  "aiExperience": {
    "label": "使用 AI 工具的经验",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "aiExperience-0",
        "label": "尚未使用"
      },
      {
        "value": "aiExperience-1",
        "label": "尝试过，但不熟悉"
      },
      {
        "value": "aiExperience-2",
        "label": "偶尔用于学习或工作任务"
      },
      {
        "value": "aiExperience-3",
        "label": "经常用于任务，并会核查结果"
      },
      {
        "value": "aiExperience-4",
        "label": "能设计或整合 AI 工作流程"
      },
      {
        "value": "aiExperience-5",
        "label": "不确定／不便说明"
      }
    ]
  },
  "mobility": {
    "label": "地点与流动意愿",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择（可跳过）"
      },
      {
        "value": "mobility-0",
        "label": "优先留在目前地区"
      },
      {
        "value": "mobility-1",
        "label": "可在省内调整"
      },
      {
        "value": "mobility-2",
        "label": "可跨省／跨地区迁移"
      },
      {
        "value": "mobility-3",
        "label": "优先远程工作"
      },
      {
        "value": "mobility-4",
        "label": "尚未确定"
      }
    ]
  },
  "goal": {
    "label": "当前最主要的职业目标",
    "type": "select",
    "options": [
      {
        "value": "",
        "label": "请选择"
      },
      {
        "value": "goal-0",
        "label": "先了解适合探索的方向"
      },
      {
        "value": "goal-1",
        "label": "寻找实习或实践机会"
      },
      {
        "value": "goal-2",
        "label": "寻找第一份正式工作"
      },
      {
        "value": "goal-3",
        "label": "在现有方向继续发展"
      },
      {
        "value": "goal-4",
        "label": "转行业或转岗位"
      },
      {
        "value": "goal-5",
        "label": "提升技能，适应工作变化"
      },
      {
        "value": "goal-6",
        "label": "重返职场"
      },
      {
        "value": "goal-7",
        "label": "探索自由职业或灵活就业"
      },
      {
        "value": "goal-8",
        "label": "其他目标"
      },
      {
        "value": "goal-9",
        "label": "暂时不确定"
      }
    ]
  },
  "major": {
    "label": "专业或学习方向",
    "type": "text",
    "maxLength": 80
  },
  "experience": {
    "label": "做过哪些工作、实习或实践任务",
    "type": "text",
    "maxLength": 800
  },
  "skillDetails": {
    "label": "技能补充",
    "type": "text",
    "maxLength": 500
  },
  "location": {
    "label": "目前所在地区",
    "type": "text",
    "maxLength": 80
  },
  "targetLocation": {
    "label": "希望工作的地区",
    "type": "text",
    "maxLength": 120
  },
  "goalDetails": {
    "label": "目标与偏好补充",
    "type": "text",
    "maxLength": 800
  },
  "skills": {
    "label": "你已有的技能（选填，可多选）",
    "type": "multiple",
    "options": [
      {
        "value": "skills-0",
        "label": "沟通与协作"
      },
      {
        "value": "skills-1",
        "label": "写作与表达"
      },
      {
        "value": "skills-2",
        "label": "客户服务与销售"
      },
      {
        "value": "skills-3",
        "label": "组织协调与项目执行"
      },
      {
        "value": "skills-4",
        "label": "办公软件与信息整理"
      },
      {
        "value": "skills-5",
        "label": "数据处理与分析"
      },
      {
        "value": "skills-6",
        "label": "编程与技术开发"
      },
      {
        "value": "skills-7",
        "label": "设计与内容制作"
      },
      {
        "value": "skills-8",
        "label": "设备操作与维修"
      },
      {
        "value": "skills-9",
        "label": "教学与照护"
      },
      {
        "value": "skills-10",
        "label": "语言能力"
      }
    ]
  },
  "preferences": {
    "label": "选择工作时看重什么（选填，可多选）",
    "type": "multiple",
    "options": [
      {
        "value": "preferences-0",
        "label": "收入"
      },
      {
        "value": "preferences-1",
        "label": "稳定性"
      },
      {
        "value": "preferences-2",
        "label": "成长与学习"
      },
      {
        "value": "preferences-3",
        "label": "工作生活平衡"
      },
      {
        "value": "preferences-4",
        "label": "兴趣与工作意义"
      },
      {
        "value": "preferences-5",
        "label": "工作地点"
      },
      {
        "value": "preferences-6",
        "label": "时间灵活性"
      },
      {
        "value": "preferences-7",
        "label": "工作环境与体力要求"
      }
    ]
  }
};
