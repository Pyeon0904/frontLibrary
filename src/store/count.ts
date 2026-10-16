import { create } from "zustand";
import { combine, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useCountStore = create(
  // subscribeWithSelector 미들웨어 : 셀렉터 함수를 통해서 store의 특정 값 구독 => 해당 값이 변경될 때마다 어떤 기능 추가 수행
  subscribeWithSelector(
    immer(
      combine({ count: 0 }, (set, get) => ({
        actions: {
          increaseOne: () => {
            set((state) => {
              state.count += 1;
            });
          },
          decreaseOne: () => {
            set((state) => {
              state.count -= 1;
            });
          },
        },
      })),
    ),
  ),
);

// [ subscribeWithSelector 미들웨어 사용방법 ] : 로그아웃 후 세션 보관하는 store 값 바뀌면 로그인페이지로 보낸다든지 하는 사이드이펙트 관리에 쓰임
// 1. use~Store에 subscribe() 메서드를 호출
// 2. 첫째인수 : selector func (어떤 값 구독할지 결정하는)
// 3. 둘째인수(=listener) : callback func => 인수 : (구독한 값, prev값)
useCountStore.subscribe(
  (store) => store.count,
  (count, prevCount) => {
    console.log(count, prevCount);

    // 둘째인수(=listener)에선 현재 store의 값을 불러올 수도, 업데이트 해줄 수도 있다
    const store = useCountStore.getState(); // getState() 메서드 : 현재 store값
    // useCountStore.setState((store)=>({  })) // setState(함수형함수)
    // 여기서 count를 변경하면 카운트 업데이트로 리스너 호출 => 또 카운트 값 수정 반복 (임시 주석)
  },
);
// 첫째인수 selector func로 count의 값을 가져오는 셀렉터 함수 지정
// 둘째인수 : Listener
// 둘째인수 callback func의 1번째 인수는 구독값
// => 해당 Listener, 둘째인수 콜백함수는 2번째 인수로 prev 값도 받을 수 있다

// export const useCountStore = create<Store>((set, get) => ({
//   count: 0,
//   actions: {
//     increaseOne: () => {
//       set((store) => ({
//         count: store.count + 1,
//       }));
//     },
//     decreaseOne: () => {
//       set((store) => ({
//         count: store.count - 1,
//       }));
//     },
//   },
// }));

export const useCount = () => {
  const count = useCountStore((store) => store.count);
  return count;
};

export const useIncreaseCount = () => {
  const increase = useCountStore((store) => store.actions.increaseOne);
  return increase;
};

export const useDecreaseCount = () => {
  const decrease = useCountStore((store) => store.actions.decreaseOne);
  return decrease;
};
