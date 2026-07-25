/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useCallback, type MutableRefObject } from 'react';
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';

/**
 * Navigation state interface mirroring the critical navigation state
 * from App.tsx needed for back button decisions.
 */
export interface NavigationState {
  showVoiceModal: boolean;
  showQuizModal: boolean;
  showParentDashboard: boolean;
  showTeacherDashboard: boolean;
  selectedLessonId: number | null;
}

export type NavigationSetters = {
  setShowVoiceModal: (v: boolean) => void;
  setShowQuizModal: (v: boolean) => void;
  setShowParentDashboard: (v: boolean) => void;
  setShowTeacherDashboard: (v: boolean) => void;
  setSelectedLessonId: (v: number | null) => void;
};

/**
 * useBackButton
 *
 * Implements proper Android hardware back button support for Capacitor.
 *
 * Behavior:
 * 1. If any modal (quiz, voice practice, dashboard, etc.) is open,
 *    pressing Back closes only the topmost modal.
 * 2. If inside a lesson, Back navigates to the previous screen (exit lesson).
 * 3. If on the home screen, shows a native confirmation dialog with
 *    "Cancel" and "Exit" buttons.
 *
 * Uses @capacitor/app plugin. Prevents duplicate event listeners and
 * cleans up properly on unmount.
 */
export function useBackButton(
  navStateRef: MutableRefObject<NavigationState>,
  setters: NavigationSetters
): void {
  // Store setters in a ref to avoid stale closures
  const settersRef = useRef(setters);
  settersRef.current = setters;

  // Whether the listener has been registered
  const listenerRegistered = useRef(false);

  const handleBackButton = useCallback(async () => {
    const state = navStateRef.current;

    if (state.showVoiceModal) {
      settersRef.current.setShowVoiceModal(false);
      return;
    }

    if (state.showQuizModal) {
      settersRef.current.setShowQuizModal(false);
      return;
    }

    if (state.showParentDashboard) {
      settersRef.current.setShowParentDashboard(false);
      return;
    }

    if (state.showTeacherDashboard) {
      settersRef.current.setShowTeacherDashboard(false);
      return;
    }

    if (state.selectedLessonId !== null) {
      settersRef.current.setSelectedLessonId(null);
      return;
    }

    // On home screen — show native exit confirmation
    const { value } = await Dialog.confirm({
      title: 'Exit App',
      message: 'Do you want to exit the app?',
      okButtonTitle: 'Exit',
      cancelButtonTitle: 'Cancel',
    });
    if (value) {
      App.exitApp();
    }
  }, [navStateRef]);

  useEffect(() => {
    // Prevent duplicate registration
    if (listenerRegistered.current) {
      return;
    }

    App.addListener('backButton', () => {
      void handleBackButton();
    }).then(() => {
      listenerRegistered.current = true;
    });

    return () => {
      // Remove all listeners on cleanup (App.removeAllListeners is safer
      // than trying to remove a specific listener when we don't have the handle)
      App.removeAllListeners().catch(() => {
        // Ignore cleanup errors
      });
      listenerRegistered.current = false;
    };
  }, [handleBackButton]);
}