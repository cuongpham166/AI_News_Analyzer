import json

from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from ai.responses.inference_response import InferenceResponse


def main():
    test_texts = [
        {
            'title': 'Breaking the Gaza aid bottleneck: 106-tonne delivery arrives via new sea route',
            'publish_date': 1775858400.0,
            'source': 'UN',
            'link': 'https://news.un.org/feed/view/en/story/2026/04/1167235',
            'language': 'en',
            'text': """Speaking from Damascus, the UN Refugee Agency (UNHCR)’s representative in Syria, Asseer Al-Madaien, said that the country has seen a “sharp rise” in people crossing the border from Lebanon – more than 200,000 between 2 and 27 March.\n\n“The vast majority, nearly 180,000, are Syrians, including Syrian refugees who had fled Syria seeking safety in the past in Lebanon and now forced to flee again,” she said.\n\nMore than 28,000 Lebanese also have crossed into Syria.\n\nFleeing with nothing\n\n“Most are people fleeing the intense Israeli bombardments,” Ms. Al-Madaien told reporters in Geneva. “They arrive exhausted, traumatized and with very, very few belongings.”\n\nThe UNHCR representative said that the agency is preparing for as many as 350,000 to cross into Syria, depending on the course of the conflict.\n\nAs the humanitarian fallout continues to deepen over a month since Israeli and US airstrikes on Iran began, sparking a wider regional war, supply lines across the Middle East are already severely disrupted.\n\nThe UN World Food Programme (WFP)’s Director of Supply, Chain Corinne Fleischer, said that the agency is concerned about “all [its] big operations”.\n\nWFP currently has “70,000 metric tonnes of food that is impacted by the war…About half of them are on chartered bulk vessels and the other half are on in containers which are either on route or stuck in a port and don't move,” she said.\n\nSpeaking from Rome, Ms. Fleischer clarified that WFP has no vessels in the Strait of Hormuz but is impacted “by the ripple effect of what's happening there… vessels being stuck in ports, not berthing to ports, not leaving ports, containers not being offloaded”.\n\nCOVID precedent\n\nThe WFP official warned that similar global supply chain disruptions seen during COVID took “four to five months to get back into place once the situation's stabilized”.\n\nShipping costs have surged as carriers avoid the Suez Canal linked to the Middle East war and have to re-route around the Cape of Good Hope. This adds up to 30 days to the journey and has driven rates up 15 to 25 per cent, with fuel price hikes also hitting firms’ bottom lines.\n\nSpeaking about mitigating measures, Ms. Fleischer explained that WFP has been “asking for priority cargo for humanitarian operations” as it is the only UN organization with its own shipping department directly engaging with shipping lines and vessel owners.\n\nShe said that the agency has successfully negotiated a waiver for the surcharges that are being put in place by shipping lines and certain ports at risk in the Middle East, which represent between $2,000 to $4,000 per container – a saving of about $1.5 million so far.\n\nAfghanistan aid delays\n\nWFP is also rerouting cargo, for instance to Afghanistan, where 17 million people are food insecure.\n\nEarlier this year, food aid sourced in Pakistan was impacted by the Pakistan-Afghanistan war and initially re-routed through Iran, Ms. Fleischer said.\n\n“While we were [rerouting] to get into Bandar Abbas port of Iran, the war broke out” she explained. “We had to put it in Jebel Ali [port] in Dubai and now we will truck it from Dubai through Saudi Arabia...That adds about 1,000 euros per tonne and of course another three weeks.”\n\nThe WFP official expressed further concern about Sudan, with 19 million people “acutely hungry”, as well as Somalia and South Sudan, where operations are buckling under longer lead times and higher costs.\n\n“The financing of humanitarian operations has, since several years, not being where it should be,” she said. “We have eroded any buffer stocks. We're living from hand-to-mouth in these operations.”\n\nWith famine in areas of Sudan “there is no time”, she insisted. “Our operations and pipelines don't allow for a three-weeks-longer rerouting through the Horn of Africa."""
        }
    ]
    inference_service = InferenceProcessor()
    inference_result = inference_service.analyze(test_texts).results
    print("Load: ", inference_result)
    news_entities = inference_result[0].model_dump()
    print("Load_entities: ", news_entities["ner"])

if __name__ == '__main__':
    main()
