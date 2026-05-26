# AI News Analyzer

## Introduction

A scalable, event-driven AI platform that collects news from RSS feeds, enriches and analyzes articles in real-time using NLP models, and delivers fast, searchable insights.

By leveraging a sophisticated dual-engine Hybrid RAG system, the platform shifts dynamically from macro-trend statistical visualizations down to hyper-focused, network-aware structural intelligence briefs.

## Key Capabilities

* **Event-Driven Architecture:** Decoupled microservices communicating via a ultra-fast **NATS** messaging backbone for robust, scalable ingestion and asynchronous load balancing.
* **Intelligent Ingestion & Cleaning:** Language detection, cross-source deduplication, text normalization, and structural metadata parsing.
* **Local AI Inference:** Multi-stage text processing powered by **Hugging Face Transformers** and **ONNX Runtime** for low-latency sentiment profiling, Named Entity Recognition (NER), zero-shot classification, and deterministic summarization.
* **Triple-Engine Storage Topography:**
  * **Elasticsearch:** Inverted indexing for microsecond full-text phrase matching and time-series analytical trends.
  * **PostgreSQL:** Relational integrity layer managing source registries, statistical system profiling, and system state storage.
  * **Neo4j:** Native Knowledge Graph mapping deep multi-hop actor networks, organizational dependencies, and geopolitical entities.
* **Asynchronous Graph Enrichment:** A modular pipeline that establishes atomic database "anchors" (Source/News nodes) upon ingestion, then asynchronously backfills AI-extracted relational intelligence (Entities/Topics) straight into the graph fabric.
* **Modern Interface:** High-performance React frontend reverse-proxied behind **NGINX** for browsing and visualizing AI-enriched intelligence assets.

## Key Features

### 1. Unified News Ingestion
Efficiently orchestrates high-frequency polling across various global RSS streams. The ingestion architecture is currently pinned to official **United Nations (UN)**, 
**Deutsche Welle (DW)** global data feeds, ensuring high-density geopolitical baseline text.

### 2. Lexical & Phrase Searching
Driven by an optimized **Elasticsearch** cluster. Users can currently perform high-speed keyword queries across raw document indices. Version 2.0 roadmaps deep metadata facet routing (e.g., isolating searches strictly by pre-classified multi-layered topics or targeted spatial constraints).

### 3. Multi-Dimensional Density Analysis
The user experience is built around moving an analyst from broad, global patterns down to granular, concrete evidence through four progressively dense operational layers:
* **The Pulse Layer (The "What happened?"):** The macro statistical dashboard. High-level charts monitor volume anomalies and rolling sentiment indexes ("world mood") to instantly catch breaking news spikes exactly when a geopolitical event starts.
* **The Character Layer (The "Who is involved?"):** The high-density visualization layer. Utilizes dynamic, real-time Treemaps where entity bounding sizes immediately pinpoint the "main characters" (People, Organizations, Locations) dominating current text cycles.
* **The Evidence Layer (The "Why is it happening?"):** The micro factual archive. Provides instant reading access to targeted articles alongside compact, grounded AI summaries. This lets analysts consume verified, extracted facts across hundreds of source documents without manual reading fatigue.
* **The Connection Layer (The Relational Matrix):** The network-graph environment powered by **Neo4j**. Visualizes hidden multi-hop lines connecting diverse real-world nodes, exposing non-obvious, cross-document intelligence vectors (e.g., establishing that *Person A* and *Person B* are structurally linked across 5 independent news threads, even if they have never appeared in the same headline).

### 4. Dynamic Time Intervals
Supports flexible, relative temporal window slicing (`now-24h`, `now-7d`, `now-30d`). This enables users to seamlessly pivot their analytical viewpoint between rapid "Breaking News Tactical Tracking" and comprehensive "Historical Geopolitical Macro-Trending."
## Overview
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?logo=springboot&logoColor=white&style=for-the-badge)
![Python](https://img.shields.io/badge/python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![NATS](https://img.shields.io/badge/natsdotio-27AAE1?logo=natsdotio&logoColor=white&style=for-the-badge)
![PostgresSQL](https://img.shields.io/badge/postgresql-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![ElasticSearch](https://img.shields.io/badge/elasticsearch-005571?logo=elasticsearch&logoColor=white&style=for-the-badge)
![Neo4j](https://img.shields.io/badge/neo4j-005571?logo=neo4j&logoColor=white&style=for-the-badge)
![PyTorch](https://img.shields.io/badge/pytorch-EE4C2C?logo=pytorch&logoColor=white&style=for-the-badge)
![ONNX](https://img.shields.io/badge/onnx-005CED?logo=onnx&logoColor=white&style=for-the-badge)
![HuggingFace](https://img.shields.io/badge/huggingface-FFD21E?logo=huggingface&logoColor=white&style=for-the-badge)
![NGINX](https://img.shields.io/badge/nginx-009639?logo=nginx&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Kibana](https://img.shields.io/badge/kibana-005571?logo=kibana&logoColor=white&style=for-the-badge)

### Architecture Overview

![Overview Structure](/images/Structure.png)

### Database Overview

#### PostgresSQL: The Relational Backbone of the application
- **Use Cases**: Structured Data Storage, Complex Aggregations, Data Integrity

![PostgresSQL Structure](/images/Final_DB_Diagram.png)

#### ElasticSearch: The Search & Discovery Engine
- **Use Cases**: Full-Text Search, Unstructured Data Discovery
```
{
    "mappings": {
        "properties": {
            "@timestamp": {"type": "date"},
            "sentiment_label": {"type": "keyword"},
            "sentiment": {"type": "float"},
            "topic": {"type": "keyword"},
            "entities": {
                "type": "nested",
                "properties": {
                    "value": {"type": "text","fields": {"keyword": {"type": "keyword"}}},
                    "entity_type": {"type": "keyword"}
                }
            },
            "summary": {"type": "text"},
            "full_text": {"type": "text"},
            "link": {"type": "keyword"},
            "publish_date": {"type": "date","format": "epoch_second"},
            "title": {"type": "text"},
            "source": {"type": "keyword"}
        }
    }
}
```

#### Neo4j: Graph Data Model
- **Use Cases:** 
  - This is our Knowledge Graph. Instead of rows and columns, it stores data as "Nodes" (People, Topics, etc) and "Lines" (Connections).
  - Mapping the "Discovery Layer." It finds hidden links between different people or organizations by tracking how often they appear together in the same news stories.
- **Nodes:** News, Event, Location, Organization, Person, Source, Topic
- **Relationships:**
  - **(:News)-[:COVERS]->(:Topic)**
  - **(:News)-[:MENTIONS_EVENT]->(:Event)**
  - **(:News)-[:MENTIONS_LOCATION]->(:Location)**
  - **(:News)-[:MENTIONS_ORGANIZATION]->(:Organization)**
  - **(:News)-[:MENTIONS_PERSON]->(:Person)**
  - **(:Source)-[:PUBLISHED]->(:News)**


### Inference Overview

The project utilizes a custom inference approach using Hugging face Transformers (for PyTorch models) and ONNX Runtime (for ONNX models) for high performance model execution. The PyTorch model can be converted to ONNX by the written script. Rather than relying on high level pipeline and abstractions, the preprocessing (tokenization) and post-processing (logits transformation) are implemented manually to ensure the control over the inference lifecycle

| Task                      | Model                         | Format         | Task                                                                                           |
|:--------------------------|:------------------------------|:---------------|:-----------------------------------------------------------------------------------------------|
| Topic Classification      | Fine-tuned DistilBERT         | ONNX INT8      | Categorizing news into 8 topics (Politics, Economy, Tech, etc.)                                |
| Sentiment Analysis        | distilbert-base-uncased-sst-2 | ONNX INT8      | Binary classification (Positive/Negative) to calculate "Global Temperature" metrics.           |
| News Entities Recognition | gliner-bi-base-v2             | PyTorch FP32   | Identifying and categorize 4 entity types including Person, Location, Event, and Organization. |
| Summarization             | distilbart-cnn-12-6           | PyTorch FP32   | Generating summary from long-form article text                                                 |

### Data Flow Overview
![Overview Structure](/images/Flow_v2.png)
The platform follows a clean, event-driven data pipeline that moves news articles from raw ingestion to fully analyzed and searchable content. The entire flow is **asynchronous and decoupled** thanks to **NATS** messaging, allowing independent scaling of each stage.
1. **Raw Ingestion** — RSS Scrapper periodically fetches articles from RSS sources and publishes them as raw events to the `news.raw` NATS topic.
2. **Enrichment** — The Data Enrichment service consumes data from `news.raw` and performs language detection, deduplication, text cleaning, and metadata extraction, then publishes the improved articles to the `news.enriched` topic.
3. **AI Analysis** — The Inference Bridge consumes from `news.enriched` and sends data to the Inference Layer for processing. Analyzed results are published to the `news.ai` topic.
4. **Storage** — The PostgresBridge and ElasticBridge consume the results and persist them:
  - **PostgreSQL (Structured metadata)** — First, PostgresBridge consumes data from `news.enriched` and sends it to PostgresLayer for persistence. Later, it also consumes from `news.ai` to update the PostgreSQL data with new inference data.
  - **Neo4j (Relational data)** — First, Neo4jBridge consumes data from `news.enriched` and sends it to Neo4jLayer for persistence. Later, it also consumes from `news.ai` to update the Neo4j data with new inference data.
  - **ElasticSearch (Inference data)** — ElasticBridge consumes data from `news.ai`and sends it to ElasticLayer for persistence. (Kibana dashboards for visualization)


### Optimization & Evaluation Overview
#### Fine-Tuning
- The DistilBERT model was fine-tuned on a balanced multi-class news classification dataset containing 8 categories.
- **Dataset**:
  - Classes: Economy, Entertainment, Health, Politics,Science, Sports, Technology, World
  - Samples per Class: 505
- **Training parameters**
  - Model: distilbert-base-uncased\
  - Max Sequence Length: 256 | Epochs: 5 | Learning Rate: 1e-5\
  - Batch Size: 8 (Effective Batch Size: 16) | Gradient Accumulation: 2 \
  - Weight Decay: 0.01 | Warmup Ratio: 0.1 \
  - Optimizer: AdamW | Scheduler: Linear | Evaluation Strategy: Per Epoch\
  - Hardware: AMD Ryzen 5 PRO 5650GE (CPU)
#### Evaluation
- **distilbert-base-uncased-sst-2**
  - The sentiment classifier was evaluated on a validation dataset of 3,000 samples using both the original PyTorch FP32 model and the quantized ONNX INT8 model.
  - **Dataset (Total Samples: 3000)**: Negative (1394), Positive(1606)
- **Fine-tuned DistilBERT**
  - The topic classifier was evaluated on a validation dataset of 6,000 samples using both the original PyTorch FP32 model and the quantized ONNX INT8 model.
  - **Dataset (Total Samples: 6000)**: Economy (982), Entertainment(655), Health(648), Politics(641), Science(145), Sports(915), Technology(982) and World(1032)

### Dual Engine RAG Overview
![RAG Workflow](/images/RAG.png)
#### Purpose & Usecase
Two independent RAG pathways are built to achieve total coverage over complex intelligence feeds:
- **The Vector & Network Pathway (Neo4j):** Built to answer relational questions. It excels at multi-hop analysis—uncovering hidden connections between changing actors, locations, and events, even if those connections span across completely different articles.
- **The Lexical & Metadata Pathway (Elasticsearch):** Built to answer precise situational questions. It excels at scanning thousands of words of raw text for precise tracking, while simultaneously filtering metrics like real-time temporal windows (e.g., now-24h) and sentiment scores.
#### Used Models
- **nomic-embed-text:** Generates dense vector embeddings on processed fields (title + summary + entities)
- **BAAI/bge-reranker-large:** Improves search/retrieval quality
- **Llama 3.2 3B:** Generates Local Inference
## Model Benchmarking & Performance Comparison
### DistilBERT Fine-Tuning
| Accuracy | Weighted F1 Score | Eval Loss |
|----------|-------------------|-----------|
| 80.07%   | 79.90%            | 0.675     |

### ONNX INT8 Models Evaluation
| distilbert-base-uncased-sst-2 | Accuracy | F1 Score |
|-------------------------------|----------|----------|
| PyTorch FP32                  | 83.33%   | 0.8315   |
| ONNX INT8                     | 83.33%   | 0.8322   |


| Fine-tuned DistilBERT | Accuracy | F1 Score |
|-----------------------|----------|----------|
| PyTorch FP32          | 76.32%   | 0.75     |
| ONNX INT8             | 75.85%   | 0.7415   |

### Comprehensive 3B-Class Model Evaluation Matrix
- To ensure maximum factual accuracy and operational efficiency, some small language models (SLMs) are benchmarked locally via Ollama using the exact same user query and retrieved context dossiers.
- **Test Query**: Analyze the security implications regarding the UNRWA compound incident in East Jerusalem over the last 24 hours. Who are the key organizations and people tied to this development?

| Model                 | Gen Time       | Context Adherence | Hallucination Risk | Verdict / Behavior                                                                                             |
|:----------------------|:---------------|:------------------|:-------------------|:---------------------------------------------------------------------------------------------------------------|
| **Llama 3.2 3B**      | **83.67s**     | **Excellent**     | **None**           | **Production Default.** Stays strictly within data boundaries; flags lack of evidence.                         |
| **Qwen 2.5 3B**       | **68.07s**     | Poor              | **High**           | **Fastest, but unsafe.** Hallucinated unrelated cross-domain entities (e.g., footballer Alphonso Davies).      |
| **Granite 4 3B**      | **97.09s**     | Poor              | **High**           | **Enterprise model failure.** Repeated the same cross-domain entity leakage as Qwen 2.5.                       |
| **SmolLM 3 3B**       | **125.87s**    | Moderate          | **Medium**         | **Context Bleeding.** Included unrelated geopolitical actors (Haiti context) into the Jerusalem report.        |
| **Ministral 3 3B**    | **149.49s**    | **Excellent**     | **None**           | **Best Analyst Prose.** Highly rigorous, explicitly disqualified unrelated entities, but 2x slower than Llama. |
| **Phi-3.5 Mini 3.8B** | **411.50s**    | Moderate          | **Medium**         | **Too Slow / Over-Confidence.** Extrapolated unmentioned entities (Arab League/EU) via outside knowledge.      |

**==============================Model: LLAMA 3.2 3B============================**
```
--- [ MODEL 1: LLAMA 3.2 3B ] ---
Based on Intel Dossier 1, the following analysis can be provided:

The security implications of the UNRWA compound incident in East Jerusalem 
over the last 24 hours are as follows:
* The Secretary-General of the United Nations (UN), António Guterres, has 
condemned Israel's use of the UNRWA compound for military purposes, stating 
that it represents a breach of the inviolability of United Nations premises.
* The incident has raised concerns about the security and stability of the 
region, particularly in light of ongoing tensions between Israelis and Palestinians.
* The UNRWA compound is considered a sensitive location, as it is currently 
occupied by Israeli forces, which may lead to further escalations or conflicts.

Key organizations tied to this development are:
* United Nations (UN)
* United Nations Relief and Works Agency for Palestine Refugees in the Near East (UNRWA)

Key people tied to this development are:
* António Guterres, Secretary-General of the UN
* Stéphane Dujarric, UN Spokesperson

It is worth noting that there is no direct mention of any specific security 
threats or incidents related to the UNRWA compound incident in Intel Dossier 1. 
However, it can be inferred that the situation may have raised concerns about the security 
and stability of the region, particularly given the ongoing tensions 
between Israelis and Palestinians.
```

**=========================Model: Qwen 2.5 3B=================================**
```
--- [ MODEL 2: Qwen 2.5 3B ] ---
The key organization tied to the UNRWA compound incident in East Jerusalem is the United 
Nations (UN), specifically through its Secretary-General, António Guterres. The incident 
involves a move by Israel to militarize a UN agency-assisted Palestine refugee compound in 
occupied East Jerusalem.

Key people involved include:
- António Guterres: The Secretary-General of the United Nations who condemned the Israeli 
decision.
- Alphonso Davies: A former refugee and current Bayern Munich player, captain of Canada's 
national team, and representative for the UN Refugee Agency’s (UNHCR) "first 11" football team.

The incident highlights significant security implications as it involves a breach of 
international law regarding the inviolability of United Nations premises. This could 
lead to further tensions between Israel and the UN over the status of East Jerusalem 
and the ongoing Israeli-Palestinian conflict, including potential escalations in 
military actions or diplomatic responses from other member states.

The incident also underscores broader security concerns related to the protection of 
humanitarian facilities and personnel in occupied territories, which are integral to 
maintaining stability and ensuring access for aid workers.
```

**=========================Model: Granite 4 3B==================================**
```
--- [ MODEL 3: Granite 4 3B ] ---
Based on the provided Intel Dossiers, the key organizations and people tied to the security 
implications of the UNRWA compound incident in East Jerusalem include:

1. United Nations (UN): The Secretary-General condemned Israel's use of the UNRWA compound 
for military purposes, calling it a breach of the inviolability of United Nations premises.

2. United Nations Relief and Works Agency for Palestine Refugees in the Near East (UNRWA): 
The agency is operating within the occupied Palestinian territory and has its headquarters 
in East Jerusalem.

3. Secretary-General António Guterres: He issued a statement condemning Israel's actions 
and urging them to hand back the compound to the UN.

4. International Court of Justice (ICJ): Affirmed that such Israeli actions are unlawful.

5. United Nations Office for the Coordination of Humanitarian Affairs (OCHA): Monitoring 
the situation in Gaza, where continued Israeli strikes are affecting residential areas 
and makeshift shelters.

The key people involved include:

1. Alphonso Davies: Former refugee and current professional footballer who is part of 
the UNRWA team representing refugees.

In summary, the incident involves multiple organizations like the UN and its agencies 
(UNRWA), as well as international courts affirming the illegality of Israel's actions. 
The Secretary-General and humanitarian coordination offices are monitoring the situation 
and calling for a resolution to hand back control of the compound to the UN.
```

**=========================Model: SmolLM 3 3B**==================================
```
--- [ MODEL 4: SmolLM 3 3B ] ---
Based on the provided intel dossiers, here is an analysis of the security implications 
surrounding the UNRWA compound incident in East Jerusalem:

**Key Organizations:**

1. **United Nations Relief and Works Agency for Palestine Refugees (UNRWA):**
   - The incident involves a breach of the inviolability of United Nations premises by Israel.
   - UNRWA is an integral part of the United Nations, as stated in the dossiers.

2. **International Court of Justice (ICJ):**
   - The ICJ has affirmed that military facilities cannot be established on occupied 
   Palestinian territory without authorization from the occupying power.
   - This decision underscores the illegality of Israel's actions and sets a precedent for 
   future disputes regarding UN premises in occupied territories.

3. **United Nations Security Council:**
   - While not directly mentioned, the incident may lead to increased scrutiny by the UNSC, 
   which has previously addressed similar issues involving UNRWA facilities.
   - The situation could potentially prompt further resolutions or sanctions against Israel 
   if it is deemed a breach of international law and human rights.

**Key People:**

1. **António Guterres (Secretary-General of the United Nations):**
   - Condemned Israel's use of the UNRWA compound for military purposes, emphasizing that 
   such actions violate the inviolability of UN premises.
   - Urged Israel to reverse course and hand the compound back to the UN.

2. **Vanessa Frazier:**
   - Conducted a fact-finding mission in Haiti regarding child recruitment by gangs.
   - Highlighted the vulnerability of children, particularly those associated with gangs, 
   and called for their protection under international juvenile justice standards.

**Security Implications:**

1. **International Law Violations:**
   - The incident represents a potential violation of international law, as Israel is not 
   entitled to exercise sovereign powers in any part of the occupied Palestinian territory.
   - This could lead to increased pressure on Israel from the international community and 
   potentially result in sanctions or other punitive measures.

2. **UNRWA's Mandate:**
   - The incident undermines UNRWA's mandate for providing humanitarian assistance to 
   Palestine refugees, as well as its role as a neutral observer within occupied territories.
   - This could lead to questions about the agency's ability to operate effectively and 
   safely in these areas.

3. **Regional Tensions:**
   - The situation may exacerbate tensions between Israel and other UN member states, 
   particularly those with strong ties to Palestine and the Palestinian people.
   - It could also impact regional security dynamics, potentially leading to increased 
   military activity or humanitarian aid challenges in the region.

4. **Humanitarian Concerns:**
   - The incident highlights ongoing concerns about the protection of civilians, 
   including children, in conflict zones.
   - Efforts by UN agencies and NGOs to provide assistance may be further 
   complicated by the situation in East Jerusalem.

In summary, the security implications surrounding the UNRWA compound incident 
are multifaceted, involving potential international law violations, challenges 
to UNRWA's mandate, regional tensions, and humanitarian concerns. The key 
organizations involved include the United Nations, the International Court of 
Justice, and the United Nations Security Council, while key individuals include 
Secretary-General António Guterres and Vanessa Frazier.
```
**=========================Model: Ministral 3 3B==================================**
```
--- [ MODEL 5: Ministral 3 3B ] ---
Based on the provided **Intel Dossiers**, here is the **objective analysis** 
of the **security implications** of the **UNRWA compound militarization in East Jerusalem** 
over the last 24 hours:

### **Key Security Implications**
1. **International Law & Sovereignty Concerns**
   - The **Secretary-General’s condemnation** of Israel’s use of the UNRWA compound for 
   military purposes highlights a **breach of international norms**, particularly the 
   **ICJ’s ruling** that Israeli occupation in East Jerusalem is unlawful.
   - The move risks **escalating regional tensions**, as it undermines UNRWA’s 
   mandate and reinforces perceptions of Israel’s **unilateral expansion of control** 
   over occupied territories.
   - The **ICJ’s ruling** (if referenced in the broader geopolitical context) could 
   lead to **legal and diplomatic consequences** for Israel, including potential sanctions 
   or further ICJ enforcement actions.

2. **Humanitarian & Displacement Risks**
   - The **OCHA report** indicates that **military presence in civilian areas** (like UNRWA 
   compounds) could **increase civilian casualties** in future conflicts.
   - The **delayed humanitarian convoys** (e.g., at Kerem Shalom crossing) suggest 
   **logistical bottlenecks**, which could worsen if military operations intensify.

3. **Potential Escalation in Gaza**
   - The **Jabalya Camp airstrike** (reportedly damaging shelters) reinforces concerns 
   that **military operations in East Jerusalem could spill over into Gaza**, given 
   historical patterns of cross-border retaliation.
   - The **UN’s emphasis on civilian protection** may prompt **international 
   condemnation or military interventions** if civilian harm persists.

### **Key Organizations & People Tied to This Development**
#### **Organizations:**
1. **United Nations (UN)**
   - **UN Secretary-General António Guterres** (condemned the move).
   - **UNRWA (United Nations Relief and Works Agency for Palestine Refugees)** 
   The agency whose compound was militarized.
   - **OCHA (Office for the Coordination of Humanitarian Affairs)** – Monitored humanitarian 
   impacts in Gaza.
   - **ICJ (International Court of Justice)** – Issued a ruling (not explicitly cited in 
   the dossiers) that Israeli occupation in East Jerusalem is unlawful.

2. **Israeli Authorities**
   - The **Israeli government** (responsible for the militarization).
   - **Military & security forces** (deployed at the compound).

#### **People:**
- **No named individuals** are explicitly linked to this incident in the provided dossiers.
- **Vanessa Frazier** (from Dossier 3) is unrelated to this event.

### **Lack of Direct Evidence on Further Developments**
- The dossiers do not provide **real-time updates** (e.g., Israeli military responses, UN 
diplomatic reactions, or Gaza escalation details beyond the last 24 hours).
- No **specific actors** (e.g., Palestinian factions, regional powers) are mentioned in 
this context.

Would you like a deeper analysis of any specific aspect (e.g., legal, humanitarian, or 
geopolitical risks)?
```

**=========================Model: Phi-3.5 Mini 3.8B===============================**
```
--- [ MODEL 6: Phi-3.5 Mini 3.8B ] ---
Based on the provided Intel Dossiers, here is an analysis of the recent developments 
concerning the United Nations Relief and Works Agency (UNRWA) compound in East Jerusalem:

Security Implications Regarding UNRWA Compound Incident:
1. **Breach of Inviolability** - The Secretary-General has condemned Israel's 
decision to use a premise designated for Palestine refugees by the United Nations, 
which is considered an "inviolable" space under international law as per his statement 
issued on [date not provided].
2. **Militarization of UN Premises** - The establishment of military facilities within 
what should be neutral territory poses a significant security concern for human rights 
and peacekeeping efforts in the region, potentially escalating tensions between Israelis 
and Palestinians or other actors involved with respect to sovereig0nty issues.
3. **Legal Concerns** - The International Court of Justice (ICJ) has previously affirmed 
that such actions are unlawful; this legal standpoint underscores the broader 
international community's disapproval and could lead to further diplomatic or economic
 consequences for Israel if they continue these practices.
4. **Impact on UNRWA Operations** - The Secretary-General urges immediate reversal of 
course, which implies that continued occupation by military forces may disrupt the 
humanitarian operations conducted within this space meant solely as a refugee 
assistance facility in occupied Palestinian territory (OPT). This could have repercussions 
for aid delivery and overall stability.
5. **Potential Escalation** - The militarization of UN premises might set precedents that 
undermine the neutrality expected from such spaces, potentially leading to further 
escalations or conflicts in a region already marked by complex geopolitical dynamics 
involving Israelis, Palestinians, and other regional players.
6. **International Relations** - The Secretary-General's condemnation may strain relations 
between the international community (especially those supporting UNRWA) and countries 
perceived as backing or tolerating such actions by Israeli authorities within occupied 
territories under their control according to various legal interpretations of sovereignty.
7. **Humanitarian Access** - The incident may exacerbate the already challenging situation 
for humanitarian agencies, which are required to navigate through additional obstacles when 
delivering aid and assistance in conflict zones or areas with heightened security concerns 
like East Jerusalem.
8. **Civil Protection Concerns** – With civilians potentially being caught between military 
operations within a UN premise meant for refugees' welfare, there is an increased risk 
of civilian harm which could lead to international scrutiny and pressure on Israel from 
human rights organizations or other states advocating protection.
9. **Precedent Setting** – The situation in East Jerusalem may set precedents that 
impact how the world views sovereignty claims over territories occupied by one state, 
potentially influencing future conflicts where similar issues arise elsewhere globally. 
10. **UN's Role and Response Capacity** - Given UNRWA’s integral role in Palestine refugee 
affairs as stated by Secretary-General Guterres, the organization may face pressure to 
respond more robustly or seek additional support from member states for its operations 
amidst these challenges.
11. **Diplomatic Engagement and Advocacy** – The incident could prompt increased diplomatic 
engagement with Israel regarding their obligations under international law concerning 
occupied territories, as well as advocating on behalf of affected populations by 
the Secretary-General or other UN officials involved in such situations. 

Key Organizations:
1. **United Nations (UN)** - The organization itself is directly implicated through its 
relief coordination office OCHA and various statements issued, including condemnations from 
Guterres himself as well as the ICJ's previous rulings on similar matters of sovereignty 
in occupied territories.
2. **United Nations Relief Works Agency (UNRWA)** - The organization whose premises are 
being militarized and which is central to this incident, providing essential services for 
Palestine refugees within the OPT. 
3. Not directly mentioned but potentially relevant: International Court of Justice – as it 
has previously affirmed that Israel's actions in such context may be unlawful according to 
international law; various member states and their governments who might influence or 
respond diplomatically due to this incident, although specific names are not provided 
within the dossiers.
4. **Not specified but potentially involved:** Other humanitarian organizations that 
could face similar challenges in delivering aid as a result of increased security concerns 
around UN premises and their operations on the ground; regional actors with interests or 
involvement in East Jerusalem's geopolitical situation, though not explicitly named here.
5. **Not specified but relevant:** The Israeli government – which is directly implicated 
for its decision to use a designated refugee compound as military facilities and may 
face international consequences from this action; the Palestinian authorities or 
representatives who would be affected by these developments, although not specifically 
mentioned in connection with East Jerusalem within provided dossiers.
6. **Not specified but potentially involved:** Civil society organizations advocating for 
human rights that might raise awareness and mobilize public opinion regarding this incident; 
media outlets reporting on the situation which could shape international perceptions of it, 
though not specifically mentioned in connection with East Jerusalem within provided dossiers.
7. **Not specified but relevant:** The UN Security Council – as they may be involved when 
discussing or addressing such incidents that have significant security implications and 
potentially require a coordinated response at the highest level; other international bodies 
like regional organizations (e.g., Arab League, European Union) which might engage in 
dialogue about these developments given their potential impact on broader geopolitical 
stability within regions affected by similar issues of sovereig0nty and humanitarian access 
challenges as mentioned for Gaza with OCHA's warnings regarding Israeli strikes.

In summary, the incident at UNRWA compound in East Jerusalem has significant security 
implications that touch upon international law, civil protection concerns within a conflict 
zone or occupied territory context, potential escalation of regional tensions and humanitarian 
access challenges for aid organizations – all while involving key entities such as the United 
Nations itself along with its subsidiary bodies like UNRWA. The situation may prompt diplomatic 
engagement from various actors to address these concerns within a complex geopolitical landscape 
where sovereignty, international law, and humanitarian needs intersect.
```
## Examples
![Dashboard](/images/Project.png)
![Entity Relationship](/images/Project_2.png)
![Neo4j](/images/Neo4j_Example.png)
