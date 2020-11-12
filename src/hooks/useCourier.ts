import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import {
  courierSearchField,
  createOnfleetWorker,
  exportCouriers,
  getCourier,
  getCouriers,
  updateCourierOnboarded,
  updateCourierPackage,
  updateCourierStatus,
  updateCourierisOnFleet,
  reAddToOnfleet,
  increaseCourierBalance
} from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    courierStore,
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    setEmptyCourier: () => {
      courierStore.set('courier')({
        sub: '',
        cognitoId: '',
        name: '',
        family_name: '',
        email: '',
        phone_number: '',
        password: '',
        license: '',
        insurance: '',
        birthdate: '',
        address: '',
        latitude: '',
        longitude: '',
        picture: '',
        status: '',
        onboarded: false,
        checkrStatus: '',
        completedHIPAATraining: false,
        createdAt: '',
        dateSent: '',
        make: '',
        carModel: '',
        tShirt: '',
        carYear: '',
        heardFrom: '',
        isWorked: false,
        isOnFleet: false,
        welcomePackageSent: false,
        hellosign: {
          fw9: '',
          isAgreementSigned: false,
          isFW9Signed: false,
          agreement: ''
        },
        photosCar: {
          front: '',
          back: '',
          left: '',
          right: ''
        },
        teams: []
      });
    },
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    reAddToOnfleet: (id: string) => reAddToOnfleet(id),
    increaseCourierBalance: (id: string, amount: number) => increaseCourierBalance(id, amount),
    courierSearchField: (field: string, search: string, limit: number) => courierSearchField(field, search, limit),
    updateCourierOnboarded: (id: string, onboarded: boolean) => updateCourierOnboarded(id, onboarded),
    createOnfleetWorker: (userId: string) => createOnfleetWorker(userId),
    getCouriers: (data: CourierPagination) => getCouriers(data),
    exportCouriers: (data: CourierPagination) => exportCouriers(data),
    updateCourierPackage: (id: string, welcomePackageSent: boolean) => updateCourierPackage(id, welcomePackageSent),
    updateCourierisOnFleet: (id: string, isOnFleet: boolean) => updateCourierisOnFleet(id, isOnFleet)
  };
}
