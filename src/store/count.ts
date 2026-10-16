import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// 미들웨어 적용 순서가 중요함
// combine > immer > subscribeWithSelector > persist > devtools

export const useCountStore = create(
  // devtools 미들웨어 : 개발자도구를 통해 store를 디버깅하도록 도와줌 (chrome에 redux devtools 설치해야함)
  devtools(
    // persist 미들웨어 : 현재 store 값을 로컬 스토리지 or 세션 스토리지에 보관해주는 미들웨어
    persist(
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
      // persist 미들웨어의 두번째 인수 : 객체형태의 옵션
      {
        name: "countStore", // 개발자도구 > application > storage > local storage 에 저장될 이름
        // partialize : actions 함수 제외 일부만 보관되게 하기 위함
        partialize: (store) => ({
          count: store.count, // count값만 보관하게 partialize
        }),
        // storage : 로컬 스토리지 대신 세션 스토리지에 데이터를 보관하도록 설정
        // => createJSONStorage 를 import 해줘야함
        storage: createJSONStorage(() => sessionStorage), // createJSONStorage 함수 불러와서 콜백함수로 sessionStorage를 반환하도록
      },
      // 로컬 스토리지 들어가보면, actions에는 빈객체임을 확인할 수 있다.
      // 그 이유는, 로컬 스토리지에 값을 보관할 때 JSON 형태로 파싱해서 보관하는데, JS함수는 JSON으로 파싱이 안됨(실행컨텍스트, 스코프체인 등 때문에)
      // => 문제 : Zustand의 persist 미들웨어는 앱을 새로고침해도 값을 다시 불러와서 적용시켜주는데 (예를들어 새로고침해서 0이 되어야하는데도 1이 유지되어 초기화됨 + 동작 안함)
      // => actions 함수가 비어있기에 => 원래 존재하던 increase나 decrease 같은 함수들이 사라지게 됨
    ),

    // devtools 미들웨어의 두번째 인수
    {
      name: "counterStore",
    },
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
