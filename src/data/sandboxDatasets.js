// Mock CSV datasets for the coding sandbox
export const SANDBOX_DATASETS = {
  iris: {
    name: 'Iris Flower Dataset',
    filename: 'iris.csv',
    columns: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'],
    csv: `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
4.6,3.1,1.5,0.2,setosa
5.0,3.6,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.4,3.2,4.5,1.5,versicolor
6.9,3.1,4.9,1.5,versicolor
5.5,2.3,4.0,1.3,versicolor
6.5,2.8,4.6,1.5,versicolor
6.3,3.3,6.0,2.5,virginica
5.8,2.7,5.1,1.9,virginica
7.1,3.0,5.9,2.1,virginica
6.3,2.9,5.6,1.8,virginica
6.5,3.0,5.8,2.2,virginica`
  },
  titanic: {
    name: 'Titanic Passenger Survival',
    filename: 'titanic.csv',
    columns: ['pclass', 'survived', 'name', 'sex', 'age', 'fare'],
    csv: `pclass,survived,name,sex,age,fare
1,1,"Cumings, Mrs. John Bradley",female,38,71.28
1,1,"Futrelle, Mrs. Jacques Heath",female,35,53.10
3,0,"Allen, Mr. William Henry",male,35,8.05
3,0,"Moran, Mr. James",male,28,8.45
1,0,"McCarthy, Mr. Timothy J",male,54,51.86
3,0,"Palsson, Master. Gosta Leonard",male,2,21.07
3,1,"Johnson, Mrs. Oscar W",female,27,11.13
2,1,"Nasser, Mrs. Nicholas",female,14,30.07
3,1,"Sandstrom, Miss. Marguerite",female,4,16.70
1,1,"Bonnell, Miss. Elizabeth",female,58,26.55
3,0,"Saundercock, Mr. William Henry",male,20,8.05
3,0,"Andersson, Mr. Anders Johan",male,39,31.27
3,0,"Vestrom, Miss. Hulda Amanda",female,14,7.85
2,1,"Hewlett, Mrs. Mary D",female,55,16.00
3,0,"Rice, Master. Eugene",male,2,29.12`
  },
  housing: {
    name: 'Boston Housing Prices',
    filename: 'housing.csv',
    columns: ['crim', 'rm', 'age', 'dis', 'tax', 'medv'],
    csv: `crim,rm,age,dis,tax,medv
0.00632,6.575,65.2,4.0900,296,24.0
0.02731,6.421,78.9,4.9671,242,21.6
0.02729,7.185,61.1,4.9671,242,34.7
0.03237,6.998,45.8,6.0622,222,33.4
0.06905,7.147,54.2,6.0622,222,36.2
0.02985,6.430,58.7,6.0622,222,28.7
0.08829,6.012,66.6,5.5605,311,22.9
0.14455,6.172,96.1,5.9505,311,27.1
0.21124,5.631,100.0,6.0821,311,16.5
0.22489,6.004,85.9,6.5921,311,18.9
0.13262,6.377,94.3,6.3467,311,15.0
0.12802,6.009,82.9,6.2267,311,18.9
0.09378,5.889,39.0,5.4509,311,21.7
0.62976,5.949,61.8,4.7075,307,20.4
0.63796,6.096,84.5,4.4619,307,18.2`
  },
  wine: {
    name: 'Wine Quality Analysis',
    filename: 'wine.csv',
    columns: ['fixed_acidity', 'citric_acid', 'chlorides', 'pH', 'alcohol', 'quality'],
    csv: `fixed_acidity,citric_acid,chlorides,pH,alcohol,quality
7.4,0.00,0.076,3.51,9.4,5
7.8,0.00,0.098,3.20,9.8,5
7.8,0.04,0.092,3.26,9.8,5
11.2,0.56,0.075,3.16,9.8,6
7.4,0.00,0.076,3.51,9.4,5
7.4,0.00,0.075,3.51,9.4,5
7.9,0.06,0.069,3.30,9.4,5
7.3,0.00,0.065,3.39,10.0,7
7.8,0.02,0.073,3.36,9.5,7
7.5,0.36,0.071,3.35,10.5,5
6.7,0.08,0.097,3.38,9.2,5
7.5,0.36,0.071,3.35,10.5,5
5.6,0.29,0.106,3.58,11.5,5
7.8,0.29,0.114,3.26,9.1,5
8.9,0.18,0.176,3.27,9.2,5`
  },
  churn: {
    name: 'Customer Churn Tracker',
    filename: 'churn.csv',
    columns: ['tenure', 'contract', 'monthly_charges', 'total_charges', 'churn'],
    csv: `tenure,contract,monthly_charges,total_charges,churn
1,Month-to-month,29.85,29.85,No
34,One year,56.95,1889.50,No
2,Month-to-month,53.85,108.15,Yes
45,One year,42.30,1840.75,No
2,Month-to-month,70.70,151.65,Yes
8,Month-to-month,99.65,820.50,Yes
22,Month-to-month,89.10,1949.40,No
10,Month-to-month,29.75,301.90,No
28,One year,104.80,3046.05,Yes
62,One year,56.15,3487.95,No
13,Month-to-month,49.95,587.45,No
16,Two year,18.95,325.30,No
58,One year,100.35,5681.10,No
49,Month-to-month,103.70,5089.45,Yes
25,Month-to-month,105.50,2686.05,No`
  },
  diamonds: {
    name: 'Kaggle Diamonds',
    filename: 'diamonds.csv',
    columns: ['carat', 'cut', 'color', 'clarity', 'price'],
    csv: `carat,cut,color,clarity,price
0.23,Ideal,E,SI2,326
0.21,Premium,E,SI1,326
0.23,Good,E,VS1,327
0.29,Premium,I,VS2,334
0.31,Good,J,SI2,335
0.24,Very Good,J,VVS2,336
0.24,Very Good,I,VVS1,336
0.26,Very Good,H,SI1,337
0.22,Fair,E,VS2,337
0.23,Very Good,H,VS1,338
0.30,Good,J,SI1,339
0.23,Ideal,J,VS1,340
0.22,Premium,F,SI1,342
0.31,Ideal,J,SI2,344
0.20,Premium,E,SI2,345`
  },
  mnist: {
    name: 'MNIST Digit Subset',
    filename: 'mnist.csv',
    columns: ['pixel_1', 'pixel_2', 'pixel_3', 'pixel_4', 'label'],
    csv: `pixel_1,pixel_2,pixel_3,pixel_4,label
0,12,15,0,5
0,0,8,13,0
0,4,14,2,4
0,1,12,12,1
0,0,0,16,9
0,0,7,15,2
0,10,12,0,1
0,0,1,14,3
0,8,16,2,1
0,0,9,16,4
0,2,13,12,7
0,0,4,15,8
0,11,10,0,9
0,0,0,14,0
0,0,6,16,5`
  },
  stocks: {
    name: 'Apple Stock AAPL',
    filename: 'stocks.csv',
    columns: ['date', 'open', 'high', 'low', 'close', 'volume'],
    csv: `date,open,high,low,close,volume
2026-07-10,182.50,184.20,181.80,183.95,52400000
2026-07-13,183.95,185.00,183.10,184.50,48900000
2026-07-14,184.50,186.40,184.00,186.20,55100000
2026-07-15,186.20,187.80,185.60,187.50,61200000
2026-07-16,187.50,188.50,187.00,188.10,50300000
2026-07-17,188.10,189.90,187.80,189.50,57800000
2026-07-20,189.50,191.00,189.00,190.20,53400000
2026-07-21,190.20,190.80,188.50,189.15,49200000
2026-07-22,189.15,189.70,187.10,187.50,46100000
2026-07-23,187.50,188.40,186.00,187.10,48500000`
  },
  weather: {
    name: 'Global Climate Metrics',
    filename: 'weather.csv',
    columns: ['date', 'city', 'temp', 'humidity', 'wind_speed', 'condition'],
    csv: `date,city,temp,humidity,wind_speed,condition
2026-07-19,New York,28.5,62.0,12.5,Sunny
2026-07-19,London,19.0,78.0,18.0,Cloudy
2026-07-19,Tokyo,31.2,85.0,9.0,Humid
2026-07-19,Paris,24.0,55.0,14.2,Sunny
2026-07-19,Sydney,14.5,50.0,22.1,Windy
2026-07-19,Mumbai,29.8,92.0,16.5,Rainy
2026-07-19,Cairo,38.0,28.0,10.0,Hot
2026-07-19,Toronto,26.1,58.0,11.5,Sunny
2026-07-19,Berlin,22.4,60.0,13.0,Cloudy
2026-07-19,Singapore,30.5,88.0,8.5,Rainy`
  },
  heart: {
    name: 'Heart Disease Clinical',
    filename: 'heart.csv',
    columns: ['age', 'sex', 'cp', 'trestbps', 'chol', 'target'],
    csv: `age,sex,cp,trestbps,chol,target
63,1,3,145,233,1
37,1,2,130,250,1
41,0,1,130,204,1
56,1,1,120,236,1
57,0,0,120,354,1
57,1,0,140,192,0
56,0,1,140,294,0
44,1,1,120,263,1
52,1,2,172,199,1
57,1,2,150,168,1
54,1,0,140,239,0
48,0,2,130,275,1
49,1,1,130,266,1
64,1,3,110,211,1
58,0,3,150,283,1`
  }
};
