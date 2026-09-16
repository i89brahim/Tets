import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type User = { id:string; name:string; email:string };
export type Transaction = { id:string; title:string; amount:number; date:string; category:string; isFixed?:boolean };
export type FixedExpense = { id:string; category:string; amount:number; isActive:boolean };
export type BankTransaction = { id:string; amount:number; date:string; description:string; approved:boolean; source:'sms' };
export type MonthSetting = { month:string; fixedIncome:number; savingsPercent:number };
const defaults = ['الإيجار','الطعام','المواصلات','الفواتير','التسوق','الصحة','الترفيه','أخرى'];
const today = new Date(); const month = today.toISOString().slice(0,7);
const seedFixed: FixedExpense[] = [{id:'rent',category:'الإيجار',amount:2500,isActive:true},{id:'food',category:'الطعام',amount:1200,isActive:true},{id:'transport',category:'المواصلات',amount:200,isActive:true},{id:'fun',category:'الترفيه',amount:40,isActive:true},{id:'other',category:'أخرى',amount:3,isActive:true}];

type State = { user:User|null; transactions:Transaction[]; fixed:FixedExpense[]; bank:BankTransaction[]; categories:string[]; settings:MonthSetting[]; setUser:(u:User|null)=>void; addTransaction:(t:Transaction)=>void; removeTransaction:(id:string)=>void; setSetting:(m:string, income?:number, savings?:number)=>void; addFixed:(f:FixedExpense)=>void; toggleFixed:(id:string)=>void; removeFixed:(id:string)=>void; addCategory:(n:string)=>void; addBank:(b:BankTransaction[])=>void; signOut:()=>void };
export const useStore = create<State>()(persist((set)=>({user:null,transactions:[],fixed:seedFixed,bank:[],categories:defaults,settings:[{month,fixedIncome:10684,savingsPercent:10}],setUser:(user)=>set({user}),addTransaction:(t)=>set(s=>({transactions:[t,...s.transactions]})),removeTransaction:(id)=>set(s=>({transactions:s.transactions.filter(t=>t.id!==id)})),setSetting:(m,income,savings)=>set(s=>{const existing=s.settings.find(x=>x.month===m); const next={month:m,fixedIncome:income??existing?.fixedIncome??10684,savingsPercent:savings??existing?.savingsPercent??10}; return {settings:[...s.settings.filter(x=>x.month!==m),next]}}),addFixed:(f)=>set(s=>({fixed:[...s.fixed,f]})),toggleFixed:(id)=>set(s=>({fixed:s.fixed.map(f=>f.id===id?{...f,isActive:!f.isActive}:f)})),removeFixed:(id)=>set(s=>({fixed:s.fixed.filter(f=>f.id!==id)})),addCategory:(n)=>set(s=>({categories:s.categories.includes(n)?s.categories:[...s.categories,n]})),addBank:(b)=>set(s=>({bank:[...s.bank,...b.filter(x=>!s.bank.some(y=>y.date===x.date&&y.amount===x.amount&&y.description===x.description))]})),signOut:()=>set({user:null})}),{name:'wallety-storage',storage:createJSONStorage(()=>AsyncStorage)}));
export const fmt=(n:number)=>`${Math.round(n).toLocaleString('en-US')} SAR`;
export const monthLabel=(m:string)=>{const [y,mo]=m.split('-'); return `${['','يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][+mo]} ${y}`};
export const shiftMonth=(m:string,d:number)=>{const x=new Date(`${m}-01T00:00:00`);x.setMonth(x.getMonth()+d);return x.toISOString().slice(0,7)};
export const useMonthData=(m:string)=>{const s=useStore(); const setting=s.settings.filter(x=>x.month<=m).sort((a,b)=>b.month.localeCompare(a.month))[0]??{fixedIncome:10684,savingsPercent:10}; const expenses=s.transactions.filter(t=>t.date.startsWith(m)); const total=expenses.reduce((a,t)=>a+t.amount,0); const bank=s.bank.filter(b=>b.approved&&b.date.startsWith(m)); return {setting,expenses,total,remaining:setting.fixedIncome-total,savings:setting.fixedIncome*setting.savingsPercent/100,bank};};
