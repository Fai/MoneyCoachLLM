'use client';
import React, { useState } from 'react';
import styles from './Home.module.css';
import { useRouter } from 'next/navigation'

interface HomeProps {}

interface Debt {
  cardName: string;
  cardType: string;
  interestRate: number;
  minimumPayment: number;
  fullPayment: number;
  remainingPeriod: number;
  debtAmount: number;
}

const Home: React.FC<HomeProps> = () => {
  const router = useRouter()
  const [cluster, setCluster] = useState<string>('');
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [saving, setSaving] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [fixedExpense, setFixedExpense] = useState<number>(0);
  const [variableExpense, setVariableExpense] = useState<number>(0);

  const handleAddDebt = () => {
    setDebts([...debts, {
      cardName: '',
      cardType: '',
      interestRate: 0,
      minimumPayment: 0,
      fullPayment: 0,
      remainingPeriod: 0,
      debtAmount: 0,
    }]);
  };

  const handleRemoveDebt = (index: number) => {
    const newDebts = debts.filter((_, i) => i !== index);
    setDebts(newDebts);
  };

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const newDebts = debts.map((debt, i) => (i === index ? { ...debt, [id]: value } : debt));
    setDebts(newDebts);
  };

  const handleCluster = (totalDebt:number, income: number, saving: number, fixedExpense: number, variableExpense: number) => {
    const netIncome = income - saving - fixedExpense - variableExpense;
    console.log('netIncome:', netIncome);
    if (netIncome <= 0) {
      console.log('คุณกำลังเข้าใกล้สถานะวิกฤติ');
      alert('คุณกำลังเข้าใกล้สถานะวิกฤติ');
    }
    const debtToIncomeRatio = totalDebt / netIncome;
    console.log('debtRatio:', debtToIncomeRatio);
    if (debtToIncomeRatio > 0.5) {
      setCluster('Red')
    }
    if (debtToIncomeRatio > 0.36) {
      setCluster('Orange')
    }
    if (debtToIncomeRatio <= 0.36) {
      setCluster('Green')
      alert('สถานะการเงินของคุณดีมาก');
    }
  };

  const handleSubmit = async () => {
    router.push('/chat');

    const masterUrl = 'http://localhost:3000';
    const data = {
      income,
      fixed_expense: fixedExpense,
      variable_expense: variableExpense,
      total_debt: totalDebt,
      saving,
      type: cluster,
      debts,
    };

    try {
      const response = await fetch(`${masterUrl}/submit_financial_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        router.push('/chat');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1>Money Coach</h1>
      </div>
      {(cluster === '') && (
        <div className={styles.formGroup} id="userInformation">
        <label htmlFor="totalDebt"> หนี้สินต่อเดือน:</label>
        <input type="number" className={styles.formControl} id="totalDebt" value={totalDebt}  onChange={(e) => setTotalDebt(Number(e.target.value))}  />
        <label htmlFor="income">รายได้:</label>
        <input type="number" className={styles.formControl} id="income" value={income}  onChange={(e) => setIncome(Number(e.target.value))}  />
        <label htmlFor="saving">เงินออม:</label>
        <input type="number" className={styles.formControl} id="saving" value={saving} onChange={(e) => setSaving(Number(e.target.value))} />
        <label htmlFor="fixedExpense">รายจ่ายคงที่:</label>
        <input type="number" className={styles.formControl} id="fixedExpense" value={fixedExpense}  onChange={(e) => setFixedExpense(Number(e.target.value))}  />
        <label htmlFor="variableExpense">รายจ่ายผันแปร:</label>
        <input type="number" className={styles.formControl} id="variableExpense" value={variableExpense}  onChange={(e) => setVariableExpense(Number(e.target.value))}  />
        <button type="button" className={styles.submitButton} onClick={() => handleCluster(totalDebt, income, saving, fixedExpense, variableExpense)}>Submit</button>
      </div>
      )}
      {(cluster === 'Orange' || cluster === 'Red') && (
        <div className={styles.formGroup} id="debtInformation">
        <div>
          {debts.map((debt, index) => (
            <div key={index}>
              <label htmlFor="cardName">บัตร:</label>
              <input
                type="text"
                className={styles.formControl}
                id="cardName"
                value={debt.cardName}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor="cardType">ประเภทบัตร:</label>
              <input
                type="text"
                className={styles.formControl}
                id="cardType"
                value={debt.cardType}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor="interestRate">อัตราดอกเบี้ย:</label>
              <input
                type="number"
                className={styles.formControl}
                id="interestRate"
                value={debt.interestRate}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor='minimumPayment'>การชำระเงินขั้นต่ำ:</label>
              <input
                type="number"
                className={styles.formControl}
                id="minimumPayment"
                value={debt.minimumPayment}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor='fullPayment'>การชำระเงินเต็มจำนวน:</label>
              <input
                type="number"
                className={styles.formControl}
                id="fullPayment"
                value={debt.fullPayment}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor='remainingPeriod'>งวดที่เหลือ:</label>
              <input
                type="number"
                className={styles.formControl}
                id="remainingPeriod"
                value={debt.remainingPeriod}
                onChange={(e) => handleChange(index, e)}
              />
              <label htmlFor='debtAmount'>จำนวนหนี้:</label>
              <input
                type="number"
                className={styles.formControl}
                id="debtAmount"
                value={debt.debtAmount}
                onChange={(e) => handleChange(index, e)}
              />
              <button type="button" className={styles.removeButton} onClick={() => handleRemoveDebt(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={handleAddDebt}>Add Debt</button>
          <button type="button" className={styles.submitButton} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      )}
    </>
  );
};

export default Home;