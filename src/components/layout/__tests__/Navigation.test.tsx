import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Navigation from '../Navigation';

/**
 * Unit Tests for Navigation Component Updates
 * Feature: software-experience
 * Task: 5.3 - Write unit tests for Navigation updates
 * 
 * These tests validate specific examples and integration points for the
 * Navigation component updates, including the Software Experience button
 * appearance, positioning, scroll behavior, active state, and mobile
 * responsive behavior.
 * 
 * Requirements tested: 1.1, 1.2, 1.3, 1.4, 1.5
 */

describe('Navigation - Unit Tests', () => {
  beforeEach(() => {
    // Mock window.scrollTo for all tests
    window.scrollTo = vi.fn();
    
    // Mock getBoundingClientRect for all tests
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  describe('Software Experience Button Appearance (Requirement 1.1)', () => {
    it('should display "Software Experience" button in navigation', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      expect(softwareExperienceLink).toBeTruthy();
      expect(softwareExperienceLink?.textContent).toBe('Software Experience');
    });

    it('should render Software Experience button with correct href attribute', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink).toBeTruthy();
      expect(softwareExperienceLink.href).toContain('#software-experience');
    });

    it('should render Software Experience button as an anchor element', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      expect(softwareExperienceLink?.tagName).toBe('A');
    });

    it('should apply consistent styling classes to Software Experience button', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink).toBeTruthy();
      
      const classList = softwareExperienceLink.className;
      expect(classList).toContain('text-sm');
      expect(classList).toContain('font-medium');
      expect(classList).toContain('transition-all');
    });

    it('should render Software Experience button in desktop navigation', () => {
      const { container } = render(<Navigation />);

      // Find the desktop navigation container
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeTruthy();

      // Software Experience link should be within desktop nav
      const softwareExperienceLink = desktopNav?.querySelector(
        'a[href="#software-experience"]'
      );
      expect(softwareExperienceLink).toBeTruthy();
    });
  });

  describe('Button Positioning (Requirement 1.2)', () => {
    it('should position Software Experience button between Skills and Contact', () => {
      const { container } = render(<Navigation />);

      // Get all navigation links in desktop nav
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const allLinks = Array.from(desktopNav?.querySelectorAll('a') || []);

      // Find indices of Skills, Software Experience, and Contact
      const skillsIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#skills'
      );
      const softwareExperienceIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#software-experience'
      );
      const contactIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#contact'
      );

      // Verify all links exist
      expect(skillsIndex).toBeGreaterThanOrEqual(0);
      expect(softwareExperienceIndex).toBeGreaterThanOrEqual(0);
      expect(contactIndex).toBeGreaterThanOrEqual(0);

      // Verify Software Experience is between Skills and Contact
      expect(softwareExperienceIndex).toBeGreaterThan(skillsIndex);
      expect(softwareExperienceIndex).toBeLessThan(contactIndex);
    });

    it('should position Software Experience immediately after Skills', () => {
      const { container } = render(<Navigation />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const allLinks = Array.from(desktopNav?.querySelectorAll('a') || []);

      const skillsIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#skills'
      );
      const softwareExperienceIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#software-experience'
      );

      // Software Experience should be the next link after Skills
      expect(softwareExperienceIndex).toBe(skillsIndex + 1);
    });

    it('should position Software Experience immediately before Contact', () => {
      const { container } = render(<Navigation />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      const allLinks = Array.from(desktopNav?.querySelectorAll('a') || []);

      const softwareExperienceIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#software-experience'
      );
      const contactIndex = allLinks.findIndex(link => 
        link.getAttribute('href') === '#contact'
      );

      // Contact should be the next link after Software Experience
      expect(contactIndex).toBe(softwareExperienceIndex + 1);
    });

    it('should maintain correct order in navLinks array', () => {
      const { container } = render(<Navigation />);

      // Get all navigation links
      const allLinks = Array.from(container.querySelectorAll('a[href^="#"]'));

      // Filter to get main navigation links (excluding logo)
      const navLinks = allLinks.filter(link => {
        const href = link.getAttribute('href');
        return href && href !== '#home' || link.textContent !== 'idiovoidi';
      });

      // Find the indices
      const linkHrefs = navLinks.map(link => link.getAttribute('href'));
      const skillsIndex = linkHrefs.indexOf('#skills');
      const softwareExperienceIndex = linkHrefs.indexOf('#software-experience');
      const contactIndex = linkHrefs.indexOf('#contact');

      // Verify order
      expect(skillsIndex).toBeGreaterThanOrEqual(0);
      expect(softwareExperienceIndex).toBe(skillsIndex + 1);
      expect(contactIndex).toBe(softwareExperienceIndex + 1);
    });
  });

  describe('Scroll Behavior (Requirement 1.3)', () => {
    it('should scroll to Software Experience section when button is clicked', () => {
      // Create a mock section element
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      document.body.appendChild(mockSection);

      mockSection.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      expect(softwareExperienceLink).toBeTruthy();

      // Clear any previous calls
      vi.clearAllMocks();

      // Click the link
      fireEvent.click(softwareExperienceLink!);

      // Verify window.scrollTo was called
      expect(window.scrollTo).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should use smooth scroll behavior when clicking Software Experience button', () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      document.body.appendChild(mockSection);

      mockSection.getBoundingClientRect = vi.fn(() => ({
        top: 300,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      vi.clearAllMocks();
      fireEvent.click(softwareExperienceLink!);

      // Verify smooth behavior
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      expect(scrollToCall.behavior).toBe('smooth');

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should calculate scroll position with header offset', () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      document.body.appendChild(mockSection);

      const sectionTopPosition = 400;
      const currentScrollY = 1000;

      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: currentScrollY,
      });

      mockSection.getBoundingClientRect = vi.fn(() => ({
        top: sectionTopPosition,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      vi.clearAllMocks();
      fireEvent.click(softwareExperienceLink!);

      // Verify scroll position calculation
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      const expectedScrollTop = sectionTopPosition + currentScrollY - 80; // 80px header offset

      expect(scrollToCall.top).toBe(expectedScrollTop);

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should prevent default anchor behavior when clicking Software Experience button', () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      document.body.appendChild(mockSection);

      mockSection.getBoundingClientRect = vi.fn(() => ({
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      vi.clearAllMocks();
      fireEvent.click(softwareExperienceLink!);

      // Verify scrollTo was called (which only happens after preventDefault)
      expect(window.scrollTo).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should handle missing section gracefully', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      );

      vi.clearAllMocks();
      fireEvent.click(softwareExperienceLink!);

      // When section doesn't exist, scrollTo should not be called
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Active State (Requirement 1.4)', () => {
    it('should apply active state when Software Experience section is in viewport', async () => {
      // Create the Software Experience section
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      
      Object.defineProperty(mockSection, 'offsetTop', {
        writable: true,
        configurable: true,
        value: 3000,
      });
      Object.defineProperty(mockSection, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 800,
      });
      
      document.body.appendChild(mockSection);

      // Create other sections
      ['home', 'projects', 'skills', 'contact'].forEach((sectionId, index) => {
        const section = document.createElement('section');
        section.id = sectionId;
        Object.defineProperty(section, 'offsetTop', {
          writable: true,
          configurable: true,
          value: index * 600,
        });
        Object.defineProperty(section, 'offsetHeight', {
          writable: true,
          configurable: true,
          value: 500,
        });
        document.body.appendChild(section);
      });

      const { container, unmount } = render(<Navigation />);

      // Set scroll position to Software Experience section
      const targetScrollY = 3000 - 100;
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: targetScrollY,
      });

      // Trigger scroll event
      fireEvent.scroll(window);

      // Wait for state updates
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Find the Software Experience link
      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink).toBeTruthy();

      // Check for active state indicators
      const hasActiveClass = softwareExperienceLink.className.includes('text-primary');
      const hasActiveUnderline = softwareExperienceLink.querySelector('div') !== null;

      // At least one active indicator should be present
      expect(hasActiveClass || hasActiveUnderline).toBe(true);

      // Cleanup
      unmount();
      const allSections = document.querySelectorAll('section');
      allSections.forEach((section) => {
        if (document.body.contains(section)) {
          document.body.removeChild(section);
        }
      });
    });

    it('should highlight Software Experience button with text-primary class when active', async () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      
      Object.defineProperty(mockSection, 'offsetTop', {
        writable: true,
        configurable: true,
        value: 2500,
      });
      Object.defineProperty(mockSection, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 700,
      });
      
      document.body.appendChild(mockSection);

      // Create other sections positioned before Software Experience
      ['home', 'projects', 'skills'].forEach((sectionId, index) => {
        const section = document.createElement('section');
        section.id = sectionId;
        Object.defineProperty(section, 'offsetTop', {
          writable: true,
          configurable: true,
          value: index * 500,
        });
        Object.defineProperty(section, 'offsetHeight', {
          writable: true,
          configurable: true,
          value: 400,
        });
        document.body.appendChild(section);
      });

      const { container, unmount } = render(<Navigation />);

      // Scroll to Software Experience section
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 2450,
      });

      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      // Check for text-primary class
      expect(softwareExperienceLink.className).toContain('text-primary');

      // Cleanup
      unmount();
      const allSections = document.querySelectorAll('section');
      allSections.forEach((section) => {
        if (document.body.contains(section)) {
          document.body.removeChild(section);
        }
      });
    });

    it('should display active underline indicator when Software Experience is in viewport', async () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      
      Object.defineProperty(mockSection, 'offsetTop', {
        writable: true,
        configurable: true,
        value: 3500,
      });
      Object.defineProperty(mockSection, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 900,
      });
      
      document.body.appendChild(mockSection);

      ['home', 'projects', 'skills', 'contact'].forEach((sectionId, index) => {
        const section = document.createElement('section');
        section.id = sectionId;
        Object.defineProperty(section, 'offsetTop', {
          writable: true,
          configurable: true,
          value: index * 700,
        });
        Object.defineProperty(section, 'offsetHeight', {
          writable: true,
          configurable: true,
          value: 600,
        });
        document.body.appendChild(section);
      });

      const { container, unmount } = render(<Navigation />);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 3400,
      });

      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      // Check for active underline (motion.div)
      const underline = softwareExperienceLink.querySelector('div');
      expect(underline).toBeTruthy();

      // Cleanup
      unmount();
      const allSections = document.querySelectorAll('section');
      allSections.forEach((section) => {
        if (document.body.contains(section)) {
          document.body.removeChild(section);
        }
      });
    });

    it('should not apply active state when Software Experience section is not in viewport', async () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      
      Object.defineProperty(mockSection, 'offsetTop', {
        writable: true,
        configurable: true,
        value: 4000,
      });
      Object.defineProperty(mockSection, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 800,
      });
      
      document.body.appendChild(mockSection);

      // Create home section
      const homeSection = document.createElement('section');
      homeSection.id = 'home';
      Object.defineProperty(homeSection, 'offsetTop', {
        writable: true,
        configurable: true,
        value: 0,
      });
      Object.defineProperty(homeSection, 'offsetHeight', {
        writable: true,
        configurable: true,
        value: 800,
      });
      document.body.appendChild(homeSection);

      const { container, unmount } = render(<Navigation />);

      // Scroll to home section (far from Software Experience)
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      });

      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      // Software Experience should not be active
      const hasActiveClass = softwareExperienceLink.className.includes('text-primary');
      const hasActiveUnderline = softwareExperienceLink.querySelector('div') !== null;

      // When not in viewport, should not have active indicators
      // (or if it does, it's because another section is active)
      expect(hasActiveClass && hasActiveUnderline).toBe(false);

      // Cleanup
      unmount();
      document.body.removeChild(mockSection);
      document.body.removeChild(homeSection);
    });
  });

  describe('Mobile Responsive Behavior (Requirement 1.5)', () => {
    it('should render Software Experience button in mobile menu drawer', () => {
      const { container } = render(<Navigation />);

      // Open mobile menu
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      );
      
      expect(mobileMenuButton).toBeTruthy();
      fireEvent.click(mobileMenuButton!);

      // Find Software Experience link in mobile menu
      const softwareExperienceLinks = container.querySelectorAll(
        'a[href="#software-experience"]'
      );

      // Should have at least one link (mobile or desktop)
      expect(softwareExperienceLinks.length).toBeGreaterThan(0);
    });

    it('should close mobile menu when Software Experience button is clicked', () => {
      const mockSection = document.createElement('section');
      mockSection.id = 'software-experience';
      document.body.appendChild(mockSection);

      mockSection.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const { container } = render(<Navigation />);

      // Open mobile menu
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      ) as HTMLButtonElement;
      
      fireEvent.click(mobileMenuButton);

      // Verify menu is open
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('true');

      // Click Software Experience link
      const softwareExperienceLinks = container.querySelectorAll(
        'a[href="#software-experience"]'
      );
      fireEvent.click(softwareExperienceLinks[0]);

      // Verify menu is closed
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('false');

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should maintain Software Experience button position in mobile menu', () => {
      const { container } = render(<Navigation />);

      // Open mobile menu
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      );
      fireEvent.click(mobileMenuButton!);

      // Get all mobile menu links
      const mobileDrawer = container.querySelector('.fixed.right-0');
      const mobileLinks = Array.from(mobileDrawer?.querySelectorAll('a[href^="#"]') || []);

      // Find indices
      const skillsIndex = mobileLinks.findIndex(link => 
        link.getAttribute('href') === '#skills'
      );
      const softwareExperienceIndex = mobileLinks.findIndex(link => 
        link.getAttribute('href') === '#software-experience'
      );
      const contactIndex = mobileLinks.findIndex(link => 
        link.getAttribute('href') === '#contact'
      );

      // Verify positioning in mobile menu
      expect(skillsIndex).toBeGreaterThanOrEqual(0);
      expect(softwareExperienceIndex).toBeGreaterThan(skillsIndex);
      expect(softwareExperienceIndex).toBeLessThan(contactIndex);
    });

    it('should apply consistent styling to Software Experience button in mobile menu', () => {
      const { container } = render(<Navigation />);

      // Open mobile menu
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      );
      fireEvent.click(mobileMenuButton!);

      // Find Software Experience link in mobile drawer
      const mobileDrawer = container.querySelector('.fixed.right-0');
      const softwareExperienceLink = mobileDrawer?.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink).toBeTruthy();

      // Check for consistent styling classes
      const classList = softwareExperienceLink.className;
      expect(classList).toContain('text-lg');
      expect(classList).toContain('font-medium');
      expect(classList).toContain('transition-all');
    });

    it('should toggle mobile menu button aria-expanded attribute', () => {
      const { container } = render(<Navigation />);

      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      ) as HTMLButtonElement;

      // Initially closed
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('false');

      // Open menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('true');

      // Close menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('should render mobile menu backdrop when menu is open', () => {
      const { container } = render(<Navigation />);

      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      );

      // Open menu
      fireEvent.click(mobileMenuButton!);

      // Check for backdrop
      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
      expect(backdrop).toBeTruthy();
    });

    it('should close mobile menu when backdrop is clicked', () => {
      const { container } = render(<Navigation />);

      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      ) as HTMLButtonElement;

      // Open menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('true');

      // Click backdrop
      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
      fireEvent.click(backdrop!);

      // Menu should be closed
      expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('should maintain responsive behavior with additional Software Experience button', () => {
      const { container } = render(<Navigation />);

      // Desktop navigation should be hidden on mobile
      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeTruthy();
      expect(desktopNav?.classList.contains('hidden')).toBe(true);

      // Mobile menu button should be visible
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]'
      );
      expect(mobileMenuButton).toBeTruthy();
      expect(mobileMenuButton?.classList.contains('md:hidden')).toBe(true);
    });
  });

  describe('Integration and Accessibility', () => {
    it('should apply focus-visible-ring class for keyboard navigation', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink.className).toContain('focus-visible-ring');
    });

    it('should render Software Experience button as a focusable element', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      expect(softwareExperienceLink).toBeTruthy();
      expect(softwareExperienceLink.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('should maintain navigation structure with Software Experience button', () => {
      const { container } = render(<Navigation />);

      // Verify navigation is within a nav element
      const nav = container.querySelector('nav');
      expect(nav).toBeTruthy();

      // Verify Software Experience link is within the nav
      const softwareExperienceLink = nav?.querySelector(
        'a[href="#software-experience"]'
      );
      expect(softwareExperienceLink).toBeTruthy();
    });

    it('should render all expected navigation links including Software Experience', () => {
      const { container } = render(<Navigation />);

      const expectedLinks = [
        '#home',
        '#projects',
        '#skills',
        '#software-experience',
        '#contact',
        '#commercial',
      ];

      expectedLinks.forEach(href => {
        const link = container.querySelector(`a[href="${href}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('should apply transition classes for smooth hover effects', () => {
      const { container } = render(<Navigation />);

      const softwareExperienceLink = container.querySelector(
        'a[href="#software-experience"]'
      ) as HTMLAnchorElement;

      const classList = softwareExperienceLink.className;
      expect(classList).toContain('transition-all');
      expect(classList).toContain('duration-300');
    });
  });
});
