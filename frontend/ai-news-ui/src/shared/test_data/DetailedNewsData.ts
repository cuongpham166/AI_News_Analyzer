import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import type Response from '@/shared/types/Response.ts';

const DetailedNewsData: Response<DetailedNews> = {
  success: true,
  message: 'Success',
  data: {
    id: '51484566-5979-4779-a153-644d39274749',
    title: 'International Criminal Court Prosecutor Karim Khan dismissed',
    publishDate: '2026-07-24T10:00:00.000+00:00',
    link: 'https://news.un.org/feed/view/en/story/2026/07/1168025',
    language: 'en',
    fullText:
      "The decision was made by simple majority during a closed-door vote among the 125-member Assembly of States Parties to dismiss Mr. Khan, who Member States had elected to serve a nine-year term as the court’s prosecutor in 2021.\n\n“The Assembly has decided by a majority of 82 States Parties that…prosecutor Karim Kahn committed serious conduct and a serious breach of duty…and to remove [him] from office,” the Assembly president announced, calling for the dignity and privacy of all those involved.\n\nThe ICC, which has a cooperation agreement with the UN, has issued several high-profile arrest warrants in recent years, including for Russian President Vladimir Putin in 2023 and Israeli Prime Minister Benjamin Netanyahu in 2024.\n\nThe ICC Assembly will be charged with electing a new prosecutor shortly.\n\nWatch the ICC oversight body's announcement here:\n\nConvictions and limitations\n\nSince its creation in 2002 by the landmark Rome Statute, the ICC has set international standards for adjudicating the world’s gravest crimes, with seven convictions and a current docket of 34 cases.\n\nThe court cannot make arrests without State support, in particular that of its 125 members.\n\nNot all nations have joined, including Israel and the United States, both of which signed the Rome Statute in 2000, but have yet to ratify it.\n\nIn 2025, Washington imposed sanctions on nine ICC personnel, including judges, the prosecutor and deputy prosecutors, in connection with investigations of alleged war crimes against Israel and the United States.\n\nTimeline of misconduct allegations\n\nMisconduct allegations were made against Mr. Khan in 2024.\n\nIn November 2024, the ICC requested an external investigation by the UN Office of Internal Oversight Services (OIOS)\n\nIn May 2025, Mr. Khan announced a leave of absence pending the OIOS investigation while ICC deputy prosecutors took leadership of the Office of the Prosecutor\n\nIn March 2026, the Assembly received conclusions from a panel of judicial experts\n\nIn June, an assessment of the ICC Bureau of the Assembly was based on the OIOS report, underlying evidence, the advice of the panel of judicial experts and written submissions\n\nAt its meeting on 8 June, the Bureau, by qualified majority, referred the disciplinary proceedings to the Assembly, decided to suspend the prosecutor from duty with immediate effect pending a final decision and decided to convene a special session\n\nWhat is the ICC?\n\nThe ICC is a criminal court that can bring cases against individuals for war crimes or crimes against humanity.\n\nCreated with the “millions of children, women and men” in mind who “have been victims of unimaginable atrocities that deeply shock the conscience of humanity”, the world’s first permanent, treaty-based international criminal court to investigate and prosecute perpetrators of crimes against humanity, war crimes, genocide and the crime of aggression.\n\nThe court does not replace national courts. It is a court of last resort. States have the primary responsibility to investigate, try and punish the perpetrators of the most serious crimes.\n\nRead our full explainer here.",
    source: {
      id: 1,
      name: 'UN',
    },
    inference: {
      summary:
        ' The decision was made by simple majority during a closed-door vote among the 125-member Assembly of States Parties to dismiss Mr. Khan . The ICC has issued several high-profile arrest warrants in recent years, including for Russian President Vladimir Putin and Israeli Prime Minister Benjamin Netanyahu .',
      sentiment: {
        label: 'negative',
        score: 0.73,
      },
      topic: {
        id: 4,
        name: 'politics',
      },
      keyphrases: [
        {
          id: 14,
          value: 'UN Office Of Internal Oversight Services',
        },
        {
          id: 11,
          value: 'International Criminal Court Prosecutor Karim Khan',
        },
        {
          id: 13,
          value: 'Icc Oversight Body',
        },
        {
          id: 16,
          value: 'ICC Bureau Of The Assembly',
        },
        {
          id: 18,
          value: 'Assembly Of States',
        },
        {
          id: 17,
          value: 'War Crimes',
        },
        {
          id: 15,
          value: 'Office Of The Prosecutor In',
        },
        {
          id: 20,
          value: 'Misconduct',
        },
        {
          id: 12,
          value: 'Profile Arrest Warrants',
        },
        {
          id: 19,
          value: 'ICC Assembly',
        },
      ],
      entities: [
        {
          id: 1,
          value: 'Karim Kahn',
          type: {
            id: 1,
            name: 'person',
          },
        },
      ],
    },
  },
  timestamp: 1786415446142,
};

export default  DetailedNewsData;