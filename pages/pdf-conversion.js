

import { useState } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import PDFConverter from '../components/PDFConverter';
import Layout from '../components/Layout';

export default function PDFConversionPage() {
  return (
    <Layout>
      <Head>
        <title>PDF Conversion | Utility Aggregator</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">PDF Conversion Tool</h1>
      <PDFConverter />
    </Layout>
  );
}


