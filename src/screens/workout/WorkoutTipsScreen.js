import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {MainScreen} from '../../common/Screen';
import TipsCard from '../../components/TipsCard';

const WorkoutTipsScreen = React.memo(() => {
  return (
    <MainScreen>
      <ScrollView contentContainerStyle={styles.container}>
        {WORKOUT_TIPS.map((tips, index) => {
          return (
            <TipsCard
              key={`${index}$`}
              title={tips.title}
              textContent={tips.textContent}
            />
          );
        })}
      </ScrollView>
    </MainScreen>
  );
});

export default WorkoutTipsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

const WORKOUT_TIPS = [
  {
    title: 'How much weight should I lift?',
    textContent: `You want to lift around 50-65% of your 1rep max . For example my 1 rep max deadlift 290kg, so I would do my deadlifts with around 140kg for reps.`,
  },
  {
    title: 'Best workout to burn fat?',
    textContent: `Aim for 10K or above steps a day or more. Track your steps via the home screen each day. Meeting this target is crucial. Doing additional cardio workouts I set via each programme will also help.`,
  },
  {
    title: 'Do I need to meet the 10K steps target?',
    textContent: `The biggest factor impacting your ability to lose fat will be your overall activity across each day (the 23 hours beyond the gym). So keep active, and meet your steps target. Yes you need to meet your target.`,
  },
  {
    title: 'What type of training do you recommend?',
    textContent: `The aim is to cover as many (if not all) resistance (weight) based workouts (push, pull and legs) throughout the week regardless of goal. Priorities weight training. Then everything else.`,
  },
  {
    title: 'How long should I rest for?',
    textContent: `Aim for the timings noted on your workout screen. This is to maximise intensity. However if you need to rest longer do so until you feel you can complete the next set with good form.`,
  },
  
  {
    title: 'When shall I increase the weight?',
    textContent: `The idea is to get progressively stronger, so aim to increase the weight during each workout phase. Check out the learn academy section for guidance on this.`,
  },
  {
    title: 'When are my rest days?',
    textContent: `You pick your rest days around your schedule. You pick what you train on the days you want to train. Schedule your workout by adding them to your mobile calendar.`,
  },
  {
    title: 'I feel sore, what do I do?',
    textContent: `You may feel a little sore after workouts, this is ok. It happens, especially when your body is adjusting to new stimulus (i.e weight training). Also, make sure you follow the videos through carefully to ensure proper technique.`,
  },
  {
    title: 'I want to change my workout?',
    textContent: `That’s fine. Just visit your workout schedule and update it (top right).`,
  },
  {
    title: 'It’s that time of the month, I’m struggling?',
    textContent: `You may feel less motivated to go the gym, feel less energetic, and uncomfortable as well and this is normal during this period (luteal phase). A few approaches would be to reduce your volume (so do one less set of each exercise across your workout). Use more machines, a leg press instead of doing a barbell back squat for example (as this may feel more comfortable) .Remember you are fighting your physiology here, don’t be hard yourself, just try and stay on track where possible.`,
  },
];
