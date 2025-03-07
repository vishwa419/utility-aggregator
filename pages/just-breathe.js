import { useState } from 'react';
import Head from 'next/head';
import BreathingExercise from '../components/BreathingExercise';
import Layout from '../components/Layout';

export default function JustBreathePage() {
  return (
    <Layout>
      <Head>
        <title>Just Breathe | Utility Aggregator</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Just Breathe</h1>
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-lg text-center">Take a moment to center yourself with this breathing exercise.</p>
        <BreathingExercise />
      </div>
    </Layout>
  );
}
