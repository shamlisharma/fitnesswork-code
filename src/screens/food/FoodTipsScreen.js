import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {MainScreen} from '../../common/Screen';
import TipsCard from '../../components/TipsCard';

const FoodTipsScreen = React.memo((props) => {
  const FOOD_TIPS = [
    {
      title: 'Do I have to measure my food?',
      textContent: `Yes, always measure your foods, this is central to you to getting results, and getting them faster especially if fat loss is the goal.`,
    },
    {
      title: 'Do I need to hit my calories target?',
      textContent: `For fat loss always make sure you do not exceed your calories and always meet your protein target. For muscle gain, ensure you do hit your calorie target at the very least and meet your protein target.`,
    },
    {
      title: 'Cheat meal?',
      textContent: `Yes. Once a week, whenever you like. Be sensible with this and don’t overdo it in terms of portion size. Try and have it after your weekly check in.`,
    },
    {
      title: 'How do I measure the food, cooked or uncooked?',
      textContent: `Always measure your foods cooked. Some foods like oats and frozen fruit will change in weight once cooked due to changes in water volume, measure these raw.`,
    },
    {
      title: 'Can I meal prep/ eat the same meals all the time?',
      textContent: `Yes. Nothing wrong with that. However, I would try and mix things up so you are getting good coverage of nutritional content.`,
    },
    {
      title: 'I don’t like some of the foods/ ingredients, what do I do?',
      textContent: `This is fine, exchange what you don’t like with ingredients you do. Just ensure they are of similar caloric and macro value. Don’t exchange a chocolate biscuit with a chicken breast.`,
    },
    {
      title: 'Do I have to eat the food on the plan?',
      textContent: ''
    },
    {
      title: 'So I can track my meals on my fitness pal?',
      textContent: 1,
    },
    {
      title: 'Will consuming too much sugar make me fat?',
      textContent: `Sugar doesn’t make you fat, too much sugar will make you fat - just like too much of anything. Be mindful of your sugar intake, as it could lead to cravings. Reduce when you can.`,
    },
    {
      title: 'I am getting sugar cravings, what do I do?',
      textContent: `A few sugar craving preventives: sensible sugar intake (food plan does this for you), drink water, minimise processed foods, get enough sleep, stay active and spread your meals across the day.`,
    },
    {
      title: 'What can I do to reduce cravings?',
      textContent: `When cravings occur: drink water, drink a black coffee, take apple cider vinegar, brush your teeth or have 1 low sugar pot of jelly or a protein bar.`,
    },
    {
      title: 'How much water should I drink?',
      textContent: `Ladies, aim to drink 2.5 litres a day. Guys, 3.5 litres. It’s important you meet these targets.`,
    },
    {
      title: 'Can I drink alcohol on the challenge?',
      textContent: `I’d avoid drinking when on the Challenge. But if you must, go for low calorie drinks.`,
    },
    {
      title: 'What alcoholic beverages can I drink?',
      textContent: `Some options: Gin and Tonic 120 calories, Martini 140 calories, Vodka Soda with Lime 96 calories, Vodka and Lemonade 130 calories , Brandy and Coke Zero 116 calories,`,
    },
    {
      title: 'Can I add my own seasoning?',
      textContent: `I’m happy for you to add a bit more flavour to foods if you feel absolutely necessary. Just a bit, but avoid adding oil or high calorie sauces (BBQ, Mayo, Sweet Chili).`,
    },
  
    {
      title: 'Can I have an extra fruit whilst on the plan?',
      textContent: `Don’t deviate from the plan. An extra tea with milk, banana, apple or any fruit/ veg is still calories. No added extras.`,
    },
    {
      title: 'Do I really have to measure everything?',
      textContent: `Yes, but remember, if measuring your food is new to you, it will - like most new habits, be time consuming and require a bit more effort.`,
    },
    {
      title: 'It’s that time of the month, I’m struggling?',
      textContent: `Your cravings might be higher during and in the second phase of your cycle (luteal phase). Add one or two extra fruits from the recipe list to help with your cravings. Remember you may feel a little bloated/ heavier, this doesn’t mean you have put on more fat, but instead just holding more water. Remember you are fighting your physiology here, don’t be hard yourself, or overthink things, just try and stay on track where possible.`,
    },
  ];
  return (
    <MainScreen>
      <ScrollView contentContainerStyle={styles.container}>
        {FOOD_TIPS.map((tips, index) => {
          return (
            <TipsCard
              key={`${index}$`}
              title={tips.title}
              textContent={tips.textContent}
              calTarget={props?.route?.params.calTarget}
              proTarget={props?.route?.params.proTarget}

            />
          );
        })}

      </ScrollView>
    </MainScreen>
  );
});

export default FoodTipsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});


