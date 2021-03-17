import React, { ReactNode } from 'react';
import ErrorDialog from '../ErrorDialog';
import { logError } from '../../../store/actions/user';
import { withStores } from '../../../store';

interface Props {
  children: ReactNode;
  title?: any;
  body?: any;
  userStore?: any;
  onClose?: any;
}

class ErrorBoundary extends React.Component<Props> {
  public state: any = {
    hasError: false
  };

  public closeError = () => {
    const { onClose } = this.props;
    this.setState({ hasError: false });
    onClose && onClose();
  };

  public static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    const { userStore } = this.props;

    logError({
      user: userStore.state,
      userAgent: window.navigator.userAgent,
      errorMessage: error && error.message,
      errorInfo: JSON.stringify(errorInfo)
    }).catch(console.error);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDialog title={this.props.title} body={this.props.body} onClose={this.closeError} />;
    }

    return this.props.children;
  }
}

export default withStores((props: any) => <ErrorBoundary {...props} />);
