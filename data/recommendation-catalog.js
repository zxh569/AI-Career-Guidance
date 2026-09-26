// Editorial rules and learning tasks; source claims remain in market-snapshot.js.
window.RECOMMENDATION_CATALOG = {
  "version": 1,
  "directions": [
    {
      "id": "service",
      "title": "餐饮服务与门店协作",
      "industry": "餐饮与生活服务",
      "function": "餐厅服务、值班与跨店协作",
      "family": "service",
      "claims": [
        "service-model"
      ],
      "aiClaims": [
        "service-tools"
      ],
      "industries": [
        "industry-6"
      ],
      "skills": [
        "skills-0",
        "skills-2",
        "skills-3"
      ],
      "minEducation": null,
      "minYears": 0,
      "location": null,
      "onsite": true,
      "skillsToCheck": [
        [
          "沟通与服务流程",
          [
            "skills-0",
            "skills-2"
          ],
          "service-model"
        ],
        [
          "交接与协作记录",
          [
            "skills-3",
            "skills-4"
          ],
          "service-model"
        ]
      ],
      "project": "阅读一份真实餐厅的公开服务说明，整理“准备—服务—交接”流程清单，列明每一步需要核对的信息；不采集顾客资料。",
      "deliverable": "交付一页流程表及原始说明链接，请一位有服务经验的人指出至少一处遗漏并留下修订记录。",
      "ai": "智能工具可能协助排班、记录和信息查询；面对面沟通与异常处理仍需人的判断。现有企业案例不能证明岗位将增加或减少。",
      "question": "是否愿意做现场服务？可以接受哪些班次和通勤安排？只需说明工作安排，不必披露家庭情况。"
    },
    {
      "id": "cnc",
      "title": "制造业数控操作与调机",
      "industry": "制造与装备",
      "function": "CNC操作、自检与调机",
      "family": "manufacturing",
      "claims": [
        "cnc-entry"
      ],
      "aiClaims": [],
      "industries": [
        "industry-2"
      ],
      "skills": [
        "skills-8"
      ],
      "minEducation": 1,
      "minYears": 0,
      "location": "珠海",
      "onsite": true,
      "skillsToCheck": [
        [
          "设备操作与质量检查",
          [
            "skills-8"
          ],
          "cnc-entry"
        ],
        [
          "作业记录与沟通",
          [
            "skills-0",
            "skills-4"
          ],
          "cnc-entry"
        ]
      ],
      "project": "选一份设备厂商公开操作手册，整理启动前检查、异常停止和尺寸检查的阅读笔记；未经培训不操作设备，不自行修改设备程序。",
      "deliverable": "交付带页码的检查清单，由合格指导人员逐项核对；若要实操，先完成正规培训与受监督的操作考核。",
      "ai": "AI可能辅助整理工艺文件、检查记录或提出排查线索，但设备安全、尺寸核验和现场调机不能仅凭生成结果。当前资料没有该岗位替代比例。",
      "question": "是否学过机械或数控、是否做过受指导的设备操作？愿不愿接受现场培训？"
    },
    {
      "id": "logistics",
      "title": "物流单证与订单协调",
      "industry": "物流与供应链",
      "function": "单证操作、订单跟进与运输协调",
      "family": "logistics",
      "claims": [
        "logistics-docs"
      ],
      "aiClaims": [],
      "industries": [
        "industry-5"
      ],
      "skills": [
        "skills-4",
        "skills-10",
        "skills-3"
      ],
      "minEducation": 2,
      "minYears": 0,
      "location": "上海",
      "onsite": false,
      "skillsToCheck": [
        [
          "办公表格与单证核对",
          [
            "skills-4"
          ],
          "logistics-docs"
        ],
        [
          "基础英语读写",
          [
            "skills-10"
          ],
          "logistics-docs"
        ]
      ],
      "project": "使用一家物流企业真实公开的运输说明，整理术语、订单所需字段和节点检查表；用说明中的原文逐项验证，不编造客户或运单。",
      "deliverable": "交付可筛选的字段表、术语解释和全部来源链接；列出原文没有说明的字段，并能解释一次异常该向谁核实。",
      "ai": "AI可能辅助提取文件字段、翻译和分类异常；金额、日期、运输条款及交付承诺仍要回原文核验。本站尚无物流岗位AI影响的专项实证。",
      "question": "英语能否读懂简短业务邮件？能否独立整理表格与跟进事项？目标地区是否有可核实的同类岗位？"
    },
    {
      "id": "customer",
      "title": "英文咨询与客户服务",
      "industry": "旅游服务与客户支持",
      "function": "电话咨询、预订信息处理",
      "family": "business",
      "claims": [
        "english-service"
      ],
      "aiClaims": [],
      "industries": [
        "industry-6",
        "industry-4"
      ],
      "skills": [
        "skills-0",
        "skills-2",
        "skills-10"
      ],
      "minEducation": 2,
      "minYears": 0,
      "location": "上海",
      "onsite": false,
      "skillsToCheck": [
        [
          "英语服务沟通",
          [
            "skills-10"
          ],
          "english-service"
        ],
        [
          "准确检索与解释信息",
          [
            "skills-0",
            "skills-2"
          ],
          "english-service"
        ]
      ],
      "project": "选一处景区或酒店的真实公开规则，写一份中英文规则摘要；每条说明附原文位置，遇到缺失信息标注“需确认”。",
      "deliverable": "交付双语摘要与来源对照表，请能核对英文的人审阅，并记录改正；不使用任何真实游客或订单信息。",
      "ai": "AI可能处理常见问答和生成回复初稿；复杂诉求、情绪沟通及规则例外仍需要人工复核。这里没有客服裁员比例或招聘净变化证据。",
      "question": "能否用英语说明一条公开规则并处理追问？你愿意做电话沟通，还是更倾向书面服务？"
    },
    {
      "id": "commerce",
      "title": "电商客户运营与销售支持",
      "industry": "食品等消费业务",
      "function": "私域销售、电商客服",
      "family": "business",
      "claims": [
        "commerce"
      ],
      "aiClaims": [],
      "industries": [
        "industry-4",
        "industry-6"
      ],
      "skills": [
        "skills-2",
        "skills-0",
        "skills-4"
      ],
      "minEducation": 2,
      "minYears": 0,
      "location": "旌德",
      "onsite": false,
      "relevantExperience": true,
      "skillsToCheck": [
        [
          "客户沟通与运营任务",
          [
            "skills-2",
            "skills-0"
          ],
          "commerce"
        ],
        [
          "办公工具和问题记录",
          [
            "skills-4"
          ],
          "commerce"
        ]
      ],
      "project": "依据一个真实品牌的公开商品与售后规则，整理问题分类、回答依据和需升级处理的问题，不杜撰销量、顾客评价或转化率。",
      "deliverable": "交付带来源的问答与流程文档；逐条检查是否越过公开规则作承诺，并保留修订记录。",
      "ai": "AI可能帮助整理常见问题、生成文案初稿和归类咨询；产品事实、售后承诺和误导性表达仍需人工把关。现有样本不足以判断就业净变化。",
      "question": "是否有电商或私域实际任务经历？能否提供不含客户与雇主身份信息的任务说明？"
    },
    {
      "id": "warehouse",
      "title": "食品供应链仓储操作",
      "industry": "食品与仓储",
      "function": "出入库记录、仓库管理",
      "family": "logistics",
      "claims": [
        "warehouse"
      ],
      "aiClaims": [],
      "industries": [
        "industry-5",
        "industry-2"
      ],
      "skills": [
        "skills-4",
        "skills-8"
      ],
      "minEducation": 1,
      "minYears": 1,
      "location": "旌德",
      "onsite": true,
      "relevantExperience": true,
      "skillsToCheck": [
        [
          "表格与出入库流程",
          [
            "skills-4"
          ],
          "warehouse"
        ],
        [
          "现场操作核验",
          [
            "skills-8"
          ],
          "warehouse"
        ]
      ],
      "project": "用自己可合法使用的非工作私人物品做真实盘点，不记录贵重物品位置；整理字段、盘点日期和差异处理步骤，不编造库存。",
      "deliverable": "交付一份脱敏盘点表与复盘说明，并再次盘点核对；叉车等设备训练须由有资质人员指导，表格练习不能替代资格。",
      "ai": "AI可能协助识别记录差异和提出补查项；实物盘点、设备操作和异常责任不能仅由模型输出决定。尚无该样本AI改造的证据。",
      "question": "累计经验中有多少属于仓储？能否接受现场工作？如涉及设备，你已完成哪些正规培训？"
    },
    {
      "id": "care",
      "title": "养老服务与生活照护",
      "industry": "康养服务",
      "function": "养老护理与值班协作",
      "family": "care",
      "claims": [
        "care-entry"
      ],
      "aiClaims": [],
      "industries": [
        "industry-10"
      ],
      "skills": [
        "skills-9",
        "skills-0"
      ],
      "minEducation": 0,
      "minYears": 0,
      "location": "翁牛特旗",
      "onsite": true,
      "skillsToCheck": [
        [
          "照护流程与边界",
          [
            "skills-9"
          ],
          "care-entry"
        ],
        [
          "交接与观察记录",
          [
            "skills-0",
            "skills-4"
          ],
          "care-entry"
        ]
      ],
      "project": "阅读正规机构公开的照护培训介绍，整理岗位任务、培训入口和自己需确认的资格；只做资料核对，不对真实老人尝试未受训的照护或医疗操作。",
      "deliverable": "交付培训与岗位要求对照表，每项附来源日期；由合格培训人员确认下一步实践条件，不以自学文档替代上岗能力。",
      "ai": "AI可能辅助交接记录整理和排班，但真实照护涉及现场观察、沟通和安全责任。当前资料不足以判断照护岗位的自动化比例。",
      "question": "愿不愿做生活照护与夜间值班？是否有受监督实践或相关证书？无需填写健康状况或被照护者资料。"
    },
    {
      "id": "digital",
      "title": "软件与AI应用工程",
      "industry": "软件与数字技术",
      "function": "模型推理优化、机器学习应用",
      "family": "digital",
      "claims": [
        "ai-requirements"
      ],
      "aiClaims": [
        "ai-tasks"
      ],
      "industries": [
        "industry-7",
        "industry-12"
      ],
      "skills": [
        "skills-6",
        "skills-5"
      ],
      "minEducation": 3,
      "minYears": 1,
      "location": "杭州",
      "onsite": false,
      "relevantExperience": true,
      "skillsToCheck": [
        [
          "编程与可复现实现",
          [
            "skills-6"
          ],
          "ai-requirements"
        ],
        [
          "数据核验与测试",
          [
            "skills-5"
          ],
          "ai-requirements"
        ]
      ],
      "project": "从公开且允许使用的数据或文档中选一个范围很小的问题，编写可本地运行的数据校验或检索程序；保存输入来源、运行说明和失败用例，不需要付费API。",
      "deliverable": "交付代码、使用说明、真实输入来源和可复现测试；核对输出并记录失败边界，不虚构准确率或业务提升。",
      "ai": "现有样本已涉及模型应用与优化。一般知识判断：工具会改变实现方式，需求界定、测试、数据质量和交付责任仍需验证；不能由AI行业增长推出个人录用概率。",
      "question": "是否能独立写代码、排查错误并说明项目边界？总工作年限中有多少是相关技术经验？"
    },
    {
      "id": "accounting",
      "title": "成本核算与财务运营",
      "industry": "食品等实体企业",
      "function": "成本会计、财务系统与核算",
      "family": "finance",
      "claims": [
        "accounting"
      ],
      "aiClaims": [],
      "industries": [
        "industry-8",
        "industry-2"
      ],
      "skills": [
        "skills-4",
        "skills-5"
      ],
      "minEducation": 2,
      "minYears": 2,
      "location": "旌德",
      "onsite": false,
      "relevantExperience": true,
      "skillsToCheck": [
        [
          "财务表格与系统理解",
          [
            "skills-4"
          ],
          "accounting"
        ],
        [
          "成本口径与异常核验",
          [
            "skills-5"
          ],
          "accounting"
        ]
      ],
      "project": "使用一家企业公开财报中的已披露数据，整理成本项目与出处、单位和期间；只分析公开资料，不处理真实雇主账套，不杜撰凭证。",
      "deliverable": "交付可复核的计算表和口径说明，原文未披露的项目明确留空；请有财会背景的人复核，并另外确认专业、职称和相关经验。",
      "ai": "AI可能辅助资料归类、报表初稿和异常提示；会计口径、凭证真实性及责任确认仍需专业复核。本站没有该岗位AI替代比例证据。",
      "question": "是否为财会相关专业、取得相关职称、做过成本核算？办公软件熟悉不等于已经掌握财务实务。"
    },
    {
      "id": "bank",
      "title": "银行校招管理培训方向",
      "industry": "银行",
      "function": "总行管理培训生",
      "family": "finance",
      "claims": [
        "campus-bank"
      ],
      "aiClaims": [
        "hr-ai"
      ],
      "industries": [
        "industry-8"
      ],
      "skills": [
        "skills-3",
        "skills-5",
        "skills-0"
      ],
      "minEducation": 4,
      "minYears": 0,
      "location": null,
      "onsite": false,
      "campus": true,
      "skillsToCheck": [
        [
          "分析与资料核对",
          [
            "skills-5"
          ],
          "campus-bank"
        ],
        [
          "组织沟通与协作",
          [
            "skills-3",
            "skills-0"
          ],
          "campus-bank"
        ]
      ],
      "project": "阅读该校招原文及银行公开业务介绍，整理项目资格、业务问题和一段基于真实课程或实践的协作复盘。",
      "deliverable": "交付毕业时间与资格核对清单、业务阅读摘要和真实经历复盘；未核实毕业届别前不把自己写成符合条件。",
      "ai": "引用资料说明AI可参与招聘流程，不代表该银行已采用同样做法。一般知识判断：资料分析可能更依赖工具，人仍需校验解释与承担合规责任；具体岗位工作分配未知。",
      "question": "预计何时毕业、就读路径属于哪类？是否满足该项目对应届身份和专业的具体规定？无需填写学校或姓名。"
    },
    {
      "id": "intern",
      "title": "运营支持实习方向",
      "industry": "招聘与企业服务",
      "function": "活动协助、物料与数据整理",
      "family": "business",
      "claims": [
        "intern-ops"
      ],
      "aiClaims": [
        "hr-ai"
      ],
      "industries": [
        "industry-7",
        "industry-12"
      ],
      "skills": [
        "skills-3",
        "skills-4",
        "skills-1"
      ],
      "minEducation": 3,
      "minYears": 0,
      "location": "北京",
      "onsite": false,
      "intern": true,
      "skillsToCheck": [
        [
          "活动执行与协作",
          [
            "skills-3"
          ],
          "intern-ops"
        ],
        [
          "办公表格与信息整理",
          [
            "skills-4"
          ],
          "intern-ops"
        ]
      ],
      "project": "整理一次自己真实参与且可公开描述的学习或活动任务，列出任务、时间、公开产出和复盘；不填写其他参与者姓名或联系方式。",
      "deliverable": "交付脱敏任务表和真实产出说明，核对完整性，并写清每周可投入的天数与可持续时间；没有经历就先寻找真实实践机会，不编造履历。",
      "ai": "AI可能协助文字初稿、表格整理和分类；协调、执行和核对仍需人处理。招聘流程的AI调查不能证明运营实习岗位正在减少。",
      "question": "每周能到岗几天、持续多久？是否仍在读？所引旧岗位已不是当前招聘凭据。"
    }
  ]
};
